"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/app/context/BookingContext";
import { useLocation } from "@/app/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Clock, User, CreditCard } from "lucide-react";

interface SelectedSeat {
  seat_number: string;
  type: string;
  price?: number;
}

export default function SeatBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { seatLayout, isLoading, fetchSeatLayout, seatPrices, holdSeats, releaseHold, updateSeats } = useBooking();
  const { city } = useLocation();

  const theaterId = searchParams.get("theater_id");
  const theatreName = searchParams.get("theatreName");
  const movieTitle = searchParams.get("movie_title");
  const showtime = searchParams.get("showtime");
  const showDate = searchParams.get("show_date");

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Fetch seats initially
  useEffect(() => {
    if (theaterId && movieTitle && showtime && showDate) {
      fetchSeatLayout(theaterId, movieTitle, showtime, showDate);
    }
  }, [theaterId, movieTitle, showtime, showDate]);
  // -------------------------------
  // AUTO-SYNC selectedSeats with backend `selected_by_me`
  // -------------------------------
  useEffect(() => {
    const mySeats = seatLayout.filter((s: any) => s.selected_by_me);

    if (mySeats.length > 0) {
      setSelectedSeats(
        mySeats.map((s: any) => ({
          seat_number: s.seat_number,
          type: s.type,
          price: getSeatPrice(s.type),
        }))
      );
    }
  }, [seatLayout]);
  // Toggle seat selection
  const handleSeatClick = (seat: any) => {
    console.log("🖱️ Seat clicked:", seat);

    if (seat.is_booked) {
      console.log("❌ Cannot select. Booked seat.");
      return;
    }
    if (seat.is_held && !seat.selected_by_me) {
      console.log("⛔ Cannot select. Held by other user.");
      return;
    }

    const isSelected =
      selectedSeats.some(s => s.seat_number === seat.seat_number) ||
      seat.selected_by_me === true;

    console.log("👉 isSelected:", isSelected);

    if (isSelected) {
      console.log("🟪 Removing seat:", seat.seat_number);
      setSelectedSeats((prev) => prev.filter((s) => s.seat_number !== seat.seat_number));
    } else {
      console.log("🟣 Adding seat:", seat.seat_number);
      setSelectedSeats((prev) => [
        ...prev,
        { seat_number: seat.seat_number, type: seat.type, price: getSeatPrice(seat.type) },
      ]);
    }
  };


  // Price calculation
  const getSeatPrice = (type: string): number => {
    const key = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return seatPrices?.[key] ?? 0;
  };

  // Group seats row-wise
  const groupSeatsByRow = () => {
    const rows: { [key: string]: any[] } = {};
    seatLayout.forEach((seat) => {
      const row = seat.seat_number.charAt(0);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });

    Object.keys(rows).forEach((row) => {
      rows[row].sort(
        (a, b) => parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1))
      );
    });

    return rows;
  };

  // Proceed to snacks page
  const handleProceed = async () => {
    const payloadSeats = selectedSeats.map((s) => s.seat_number);

    // 1. If previous temp booking exists -> update seats instead of releasing
    const oldTempId = localStorage.getItem("tempBookingId");
    if (oldTempId) {
      // update existing temp booking's seats (keeps snacks intact)
      await updateSeats(oldTempId, payloadSeats, showDate!);
    } else {
      // create new temp booking
      const res = await holdSeats({
        theater_id: theaterId!,
        movie_title: movieTitle!,
        showtime: showtime!,
        show_date: showDate!,
        seats: payloadSeats,
      });

      if (res?.tempBookingId) localStorage.setItem("tempBookingId", res.tempBookingId);
    }

    // DO NOT clear snack cart here — snacks should persist across seat changes

    // Navigate to snacks
    router.push(
      `/snacks?theater_id=${theaterId}&movie_title=${movieTitle}&showtime=${showtime}&show_date=${showDate}&seats=${payloadSeats.join(",")}&ticketPrice=${totalPrice}`
    );
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

  if (!theaterId || !movieTitle || !showtime || !showDate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Invalid booking details</h2>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="text-purple-400 border-purple-600 hover:bg-purple-800/50"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-black font-sans text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-purple-800 bg-black/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

          <div className="mb-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="rounded-full bg-purple-900/20 text-purple-300 hover:bg-purple-800/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 text-purple-300">
              <MapPin className="h-4 w-4" />
              <p className="text-sm font-semibold">{city}</p>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {movieTitle}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-purple-300">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{theatreName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(showDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{showtime}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">

        {isLoading ? (
          <Card className="rounded-2xl border-purple-700/50 bg-purple-900/60 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <h3 className="text-xl font-bold text-white">Loading Seats...</h3>
              <p className="mt-2 text-purple-300">Please wait while we load the seating layout</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Seating Layout */}
            <Card className="rounded-2xl border border-purple-700/40 bg-black/20 backdrop-blur-xl shadow-lg shadow-purple-500/20 p-6">
              <div className="space-y-5">
                {(() => {
                  const grouped = groupSeatsByRow();
                  let lastType = "";

                  return Object.entries(grouped)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([row, seats]) => {
                      const currentType = seats[0]?.type?.toLowerCase() || "regular";
                      const showHeader = currentType !== lastType;
                      lastType = currentType;

                      return (
                        <div key={row} className="space-y-2">

                          {showHeader && (
                            <h3 className="text-center text-lg font-bold text-purple-300 tracking-wider uppercase">
                              {currentType} — ₹{getSeatPrice(seats[0].type)}
                            </h3>
                          )}

                          <div className="flex justify-center items-center gap-2">
                            <span className="w-6 text-center font-bold text-purple-300">{row}</span>

                            <div
                              className="grid gap-1"
                              style={{
                                gridTemplateColumns: `repeat(${seats.length}, minmax(0, 1fr))`,
                              }}
                            >
                              {seats.map((seat) => {
                                const isSelected =
                                  seat.selected_by_me ||
                                  selectedSeats.some((s) => s.seat_number === seat.seat_number);

                                let seatClass = "bg-gray-800 text-white hover:bg-gray-700";

                                if (isSelected) {
                                  seatClass =
                                    "bg-purple-600 text-white ring-2 ring-purple-400";
                                } else if (seat.is_booked) {
                                  seatClass =
                                    "bg-red-600/70 text-white opacity-70 cursor-not-allowed";
                                } else if (seat.is_held) {
                                  seatClass =
                                    "bg-yellow-400 text-black opacity-90 cursor-not-allowed";
                                }

                                return (
                                  <button
                                    key={seat.seat_number}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={seat.is_booked || seat.is_held}
                                    className={`h-5 w-5 rounded-sm sm:h-8 sm:w-8 md:h-9 md:w-9 flex items-center justify-center sm:rounded-md text-xs font-medium transition-all duration-200 ${seatClass}`}
                                  >
                                    {seat.seat_number.slice(1)}
                                  </button>
                                );
                              })}
                            </div>


                          </div>
                        </div>
                      );
                    });
                })()}
              </div>

              <div className="text-center mt-8">
                <div className="mx-auto h-4 w-3/4 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-b-full shadow-lg shadow-purple-500/40"></div>
                <p className="text-sm font-medium text-purple-300 tracking-widest mt-2">SCREEN</p>
              </div>
            </Card>

            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
              <Card className="rounded-2xl border-purple-700/50 bg-purple-900/40 backdrop-blur-xl p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">Selected Seats</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat.seat_number} className="bg-purple-600 text-white">
                          {seat.seat_number} - ₹{seat.price}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">₹{totalPrice}</p>
                    <p className="text-sm text-purple-300">{selectedSeats.length} seat(s)</p>

                    <Button
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                      onClick={handleProceed}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Snacks
                    </Button>

                  </div>
                </div>
              </Card>
            )}

          </>
        )}

      </div>
    </div>
  );
}
