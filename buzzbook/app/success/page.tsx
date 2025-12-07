"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

function SuccessInnerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieTitle = searchParams.get("movie_title");
  const showDate = searchParams.get("show_date");
  const showtime = searchParams.get("showtime");
  const seats = searchParams.get("seats");
  const audi_number = searchParams.get("audi_number");

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-purple-900/20 to-black text-white px-6">

      {/* Success Icon */}
      <CheckCircle2 className="text-green-400 w-28 h-28 mb-4 animate-bounce" />

      {/* Heading */}
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
        Ticket Confirmed!
      </h1>
      <p className="text-gray-300 mt-2 text-center">
        Your booking was successful. Enjoy your movie 🎬
      </p>

      {/* Ticket Card */}
      <div className="mt-8 bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-purple-200 mb-3">
          Booking Details
        </h2>

        <div className="space-y-2 text-purple-300">
          <p><strong>🎬 Movie:</strong> {movieTitle}</p>
          <p><strong>📅 Date:</strong> {showDate}</p>
          <p><strong>⏰ Showtime:</strong> {showtime}</p>
          <p><strong>🎟 Seats:</strong> {seats}</p>
          <p><strong>🏛 Audi:</strong> {audi_number}</p>
        </div>
      </div>

      {/* Go back button */}
      <Button
        className="mt-8 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-white font-semibold"
        onClick={() => router.push("/")}
      >
        Go to Home
      </Button>
    </div>
  );
}

export default function successPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white text-center">Loading...</div>}>
      <SuccessInnerPage />
    </Suspense>
  )
}


