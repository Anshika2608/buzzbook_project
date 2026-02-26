"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { useSnacks } from "@/app/context/SnackContext";
import { useBooking } from "@/app/context/BookingContext";
// import { Snacks } from "../types/theatre";
import { Snack, SnackOption, CartItem, SelectedSnack } from "../types/snacks";

function SnacksPageInner() {
  const router = useRouter();
  const hasRedirected = useRef(false);
  const searchParams = useSearchParams();
  const { updateTempBooking } = useBooking();

  const theaterId = searchParams.get("theater_id");
  const seats = searchParams.get("seats")?.split(",") || [];
  const showtime = searchParams.get("showtime");
  const showDate = searchParams.get("show_date");
  const movieTitle = searchParams.get("movie_title");
  const ticketPrice = Number(searchParams.get("ticketPrice") || 0);
  const audi_number = searchParams.get("audi_number");
  const movie_language = searchParams.get("movie_language");
  const theaterName = searchParams.get("theater_name")
  const { snacks, isLoading, fetchSnacks, requestedTheaterId,
    fetchedTheaterId, hasFetched } = useSnacks();
  const previousSnacks = JSON.parse(searchParams.get("snacks") || "[]") as CartItem[];
  const storageKey = `snack_cart_${theaterId}_${showDate}_${showtime}`;
  const [cart, setCart] = useState<CartItem[]>([]);

  /* --------------------------
       FETCH SNACKS
  ---------------------------*/

  useEffect(() => {
    if (theaterId) {

      fetchSnacks(theaterId);
    }
  }, [theaterId]);
  useEffect(() => {
    hasRedirected.current = false;
  }, [theaterId]);

  useEffect(() => {
    if (requestedTheaterId !== theaterId) return;

    if (fetchedTheaterId !== theaterId) return;

    if (!hasFetched || isLoading) return;

    if (snacks.length === 0 && !hasRedirected.current) {

      hasRedirected.current = true;

      router.replace(
        `/payment?theater_id=${theaterId}&theater_name=${theaterName}&movie_title=${movieTitle}&showtime=${showtime}&show_date=${showDate}&audi_number=${audi_number}&movie_language=${movie_language}&seats=${seats.join(
          ","
        )}&ticketPrice=${ticketPrice}&snacks=${encodeURIComponent(
          JSON.stringify([])
        )}&noSnacks=true`
      );
    }
  }, [
    requestedTheaterId,
    fetchedTheaterId,
    hasFetched,
    isLoading,
    snacks.length,
    theaterId,
  ]);
  useEffect(() => {
    if (snacks.length === 0) return;

    if (previousSnacks.length > 0) {
      setCart(previousSnacks);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCart(JSON.parse(saved));
    } else {
      setCart([]); 
    }
  }, [snacks, storageKey]);


  //CART LOGIC

  const addToCart = (snack: Snack, option: SnackOption) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === snack._id &&
          item.unit.trim().toLowerCase() === option.unit.trim().toLowerCase()
      );

      if (existing) {
        return prev.map((item) =>
          item.id === snack._id && item.unit === option.unit
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { id: snack._id, unit: option.unit, price: option.price, qty: 1 }];
    });
  };

  const decreaseQty = (snack: Snack, option: SnackOption) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === snack._id && item.unit === option.unit
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const getQty = (snackId: string, unit: string) => {
    return cart.find(
      (i) =>
        i.id === snackId && i.unit.trim().toLowerCase() === unit.trim().toLowerCase()
    )?.qty || 0;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  //PROCEED

  const goToSummary = async () => {
    const tempId = localStorage.getItem("tempBookingId");

    if (tempId && cart.length > 0) {
      const snacksPayload: SelectedSnack[] = cart.map((it) => ({
        snackId: it.id,
        unit: it.unit,
        quantity: it.qty,
      }));

      await updateTempBooking(tempId, snacksPayload);
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }

    router.push(
      `/payment?theater_id=${theaterId}&theater_name=${theaterName}&movie_title=${movieTitle}&showtime=${showtime}&show_date=${showDate}&audi_number=${audi_number}&movie_language=${movie_language}&seats=${seats.join(
        ","
      )}&ticketPrice=${ticketPrice}&snacks=${encodeURIComponent(
        JSON.stringify(cart)
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white p-5 pb-32">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Enhance Your Movie Experience
        </h2>

        {snacks.length > 0 && (
          <Button
            variant="ghost"
            className="text-purple-300 cursor-pointer border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 hover:text-white rounded-full px-5 py-2 transition-all duration-200 whitespace-nowrap"
            onClick={goToSummary}
          >
            Skip Snacks →
          </Button>
        )}
      </div>
      {isLoading ? (
        <p className="text-purple-300">Loading snacks...</p>
      ) : snacks.length === 0 ? (
        <p className="text-gray-400">No snacks available for this theatre.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {snacks.map((snack) => (
            <Card
              key={snack._id}
              className="bg-purple-900/30 border border-purple-700/30 rounded-2xl shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <CardContent className="p-5">
               
                <img
                  src={snack.snack_img?.[0]}
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                  alt="snack"
                />

                {/* Title */}
                <h3 className="mt-4 text-xl font-bold text-purple-200">
                  {snack.name}
                </h3>

                <p className="text-sm text-purple-300 mt-1">{snack.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400 mt-2">
                  <Star className="h-4 w-4" /> {snack.rating}
                </div>

                {/* Options */}
                <div className="mt-4 space-y-3">
                  {snack.quantity_options.map((option) => {
                    const qty = getQty(snack._id, option.unit);

                    return (
                      <div
                        key={option._id}
                        className="flex items-center justify-between bg-purple-800/40 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-purple-200">
                          {option.unit} — ₹{option.price}
                        </span>

                        {qty === 0 ? (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4"
                            onClick={() => addToCart(snack, option)}
                          >
                            Add +
                          </Button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800 rounded-full px-3"
                              onClick={() => decreaseQty(snack, option)}
                            >
                              −
                            </Button>

                            <span className="font-bold text-purple-100">
                              {qty}
                            </span>

                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800 rounded-full px-3"
                              onClick={() => addToCart(snack, option)}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating bottom bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-purple-900/80 backdrop-blur-lg px-6 py-4 flex justify-between items-center shadow-xl border-t border-purple-800">
          <p className="text-lg font-bold text-white">
            Total: <span className="text-green-400">₹{total}</span>
          </p>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg"
            onClick={goToSummary}
          >
            <ShoppingCart className="h-5 w-5" />
            Proceed
          </Button>
        </div>
      )}
    </div>



  );
}
export default function SnacksPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white text-center">Loading...</div>}>
      <SnacksPageInner />
    </Suspense>
  );
}
