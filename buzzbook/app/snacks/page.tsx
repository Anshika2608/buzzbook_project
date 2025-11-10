"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { useSnacks } from "@/app/context/SnackContext"; // ✅ using Snack Context

export default function SnacksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const theaterId = searchParams.get("theater_id");
  const seats = searchParams.get("seats")?.split(",") || [];
  const showtime = searchParams.get("showtime");
  const showDate = searchParams.get("show_date");
  const movieTitle = searchParams.get("movie_title");

  const { snacks, isLoading, fetchSnacks } = useSnacks(); // ✅

  const [cart, setCart] = useState<{ id: string; unit: string; price: number; qty: number }[]>([]);

  useEffect(() => {
  if (theaterId) fetchSnacks(theaterId); // ✅ now passing required argument
}, [theaterId]);

  const addToCart = (snack: any, option: any) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.id === snack._id && item.unit === option.unit
      );
      if (existing) {
        return prev.map(item =>
          item.id === snack._id && item.unit === option.unit
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { id: snack._id, unit: option.unit, price: option.price, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const goToPayment = () => {
    router.push(
      `/payment?seats=${seats.join(",")}&theater_id=${theaterId}&movie_title=${movieTitle}&showtime=${showtime}&show_date=${showDate}&snacks=${JSON.stringify(
        cart
      )}`
    );
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

      <h2 className="text-3xl font-bold text-purple-400 mb-4">Enhance Your Movie Experience 🍿</h2>

      {isLoading ? (
        <p>Loading snacks...</p>
      ) : snacks.length === 0 ? (
        <p>No snacks available for this theatre</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map(snack => (
            <Card key={snack._id} className="bg-purple-900/40 border border-purple-700/40">
              <CardContent className="p-4">
                <img
                  src={snack.snack_img?.[0]}
                  className="w-full h-48 object-cover rounded-md mb-3"
                  alt="snack"
                />

                <h3 className="text-xl font-bold">{snack.name}</h3>
                <p className="text-sm text-purple-200">{snack.description}</p>

                <div className="flex items-center gap-1 text-yellow-400 mt-1">
                  <Star className="h-4 w-4" /> {snack.rating}
                </div>

                <div className="mt-3 space-y-2">
                  {snack.quantity_options?.map(option => (
                    <div key={option._id} className="flex items-center justify-between">
                      <span className="text-sm">
                        {option.unit} - ₹{option.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => addToCart(snack, option)}
                      >
                        Add +
                      </Button>
                    </div>
                  ))}
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
