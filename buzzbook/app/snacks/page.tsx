"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { useSnacks } from "@/app/context/SnackContext";
import { useBooking } from "@/app/context/BookingContext";

export default function SnacksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const theaterId = searchParams.get("theater_id");
  const seats = searchParams.get("seats")?.split(",") || [];
  const showtime = searchParams.get("showtime");
  const showDate = searchParams.get("show_date");
  const movieTitle = searchParams.get("movie_title");
  const ticketPrice = Number(searchParams.get("ticketPrice") || 0);

  const { snacks, isLoading, fetchSnacks } = useSnacks();
  const { holdSeats } = useBooking();

  // Read previous cart (when user returns from summary page)
  const previousSnacks = JSON.parse(searchParams.get("snacks") || "[]");

  const [cart, setCart] = useState<
    { id: string; unit: string; price: number; qty: number }[]
  >([]);

  useEffect(() => {
    if (theaterId) fetchSnacks(theaterId);

    // restore snack state if user returns
    if (previousSnacks.length > 0) {
      setCart(previousSnacks);
    }
  }, [theaterId]);

  const addToCart = (snack: any, option: any) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === snack._id && item.unit === option.unit
      );

      if (existing) {
        return prev.map((item) =>
          item.id === snack._id && item.unit === option.unit
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        { id: snack._id, unit: option.unit, price: option.price, qty: 1 },
      ];
    });
  };

  const decreaseQty = (snack: any, option: any) => {
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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const goToPayment = async () => {
    await holdSeats({
      theater_id: theaterId!,
      movie_title: movieTitle!,
      showtime: showtime!,
      show_date: showDate!,
      seats,
    });

    router.push(
      `/payment?theater_id=${theaterId}
       &movie_title=${movieTitle}
       &showtime=${showtime}
       &show_date=${showDate}
       &seats=${seats.join(",")}
       &snacks=${encodeURIComponent(JSON.stringify(cart))}
       &ticketPrice=${ticketPrice}`
    );
  };

  const getQty = (snackId: string, unit: string) => {
    return cart.find((i) => i.id === snackId && i.unit === unit)?.qty || 0;
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <Button
        variant="ghost"
        className="mb-4 bg-purple-900/20 text-purple-300 hover:bg-purple-800/50 hover:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h2 className="text-3xl font-bold text-purple-400 mb-4">
        Enhance Your Movie Experience 🍿
      </h2>

      {isLoading ? (
        <p>Loading snacks...</p>
      ) : snacks.length === 0 ? (
        <p>No snacks available for this theatre</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map((snack) => (
            <Card
              key={snack._id}
              className="bg-purple-900/40 border border-purple-700/40"
            >
              <CardContent className="p-4">
                <img
                  src={snack.snack_img?.[0]}
                  className="w-full h-48 object-cover rounded-md mb-3"
                  alt="snack"
                />

                <h3 className="text-xl font-bold">{snack.name}</h3>
                <p className="text-sm text-purple-200">
                  {snack.description}
                </p>

                <div className="flex items-center gap-1 text-yellow-400 mt-1">
                  <Star className="h-4 w-4" /> {snack.rating}
                </div>

                <div className="mt-3 space-y-2">
                  {snack.quantity_options?.map((option) => {
                    const qty = getQty(snack._id, option.unit);

                    return (
                      <div
                        key={option._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {option.unit} - ₹{option.price}
                        </span>

                        {/* If qty = 0 show Add button */}
                        {qty === 0 ? (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => addToCart(snack, option)}
                          >
                            Add +
                          </Button>
                        ) : (
                          // If qty > 0 show counter buttons
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800 px-3"
                              onClick={() => decreaseQty(snack, option)}
                            >
                              −
                            </Button>

                            <span className="font-bold text-purple-200">
                              {qty}
                            </span>

                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800 px-3"
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

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-purple-900 p-4 flex justify-between items-center shadow-lg">
          <p className="font-bold text-lg">Total: ₹{total}</p>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={goToPayment}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
