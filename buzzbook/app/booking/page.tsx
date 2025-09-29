"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/app/context/BookingContext";
import { useLocation } from "@/app/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  CreditCard,
} from "lucide-react";

interface SelectedSeat {
  seat_number: string;
  type: string;
  price?: number;
}

export default function SeatBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { seatLayout, isLoading, fetchSeatLayout } = useBooking();
  const { city, movieDet } = useLocation();

  // Get URL parameters
  const theaterId = searchParams.get("theater_id");
  const theatreName = searchParams.get("theatreName");
  const movieTitle = searchParams.get("movie_title");
  const showtime = searchParams.get("showtime");
  const showDate = searchParams.get("show_date");

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Fetch seat layout on component mount
  useEffect(() => {
  if (theaterId && movieTitle && showtime && showDate) {
    fetchSeatLayout(theaterId, movieTitle, showtime, showDate);
    console.log(seatLayout)
  }
}, [theaterId, movieTitle, showtime, showDate, fetchSeatLayout]);

  useEffect(() => {
  console.log("Updated seat layout:", seatLayout);
}, [seatLayout]);



  // Handle seat selection
  const handleSeatClick = (seat: any) => {
    if (seat.is_booked) return;

    const seatId = seat.seat_number;
    const isSelected = selectedSeats.some(s => s.seat_number === seatId);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.seat_number !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, {
        seat_number: seatId,
        type: seat.type,
        price: getSeatPrice(seat.type)
      }]);
    }
  };

  // Get seat price based on type
  const getSeatPrice = (type: string): number => {
    switch (type.toLowerCase()) {
      case 'premium':
      case 'recliner':
        return 350;
      case 'executive':
        return 280;
      case 'royal':
        return 250;
      case 'normal':
      case 'regular':
      default:
        return 180;
    }
  };

  // Get seat color based on status
  const getSeatColor = (seat: any): string => {
    if (seat.is_booked) return "bg-red-500";
    if (selectedSeats.some(s => s.seat_number === seat.seat_number)) return "bg-purple-600";
    
    switch (seat.type.toLowerCase()) {
      case 'premium':
      case 'recliner':
        return "bg-yellow-500 hover:bg-yellow-400";
      case 'executive':
        return "bg-blue-500 hover:bg-blue-400";
      case 'royal':
        return "bg-green-500 hover:bg-green-400";
      default:
        return "bg-gray-500 hover:bg-gray-400";
    }
  };

  // Group seats by rows
  const groupSeatsByRow = () => {
    const rows: { [key: string]: any[] } = {};
    seatLayout.forEach(seat => {
      const row = seat.seat_number.charAt(0);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    
    // Sort seats within each row
    Object.keys(rows).forEach(row => {
      rows[row].sort((a, b) => {
        const numA = parseInt(a.seat_number.slice(1));
        const numB = parseInt(b.seat_number.slice(1));
        return numA - numB;
      });
    });
    
    return rows;
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

  if (!theaterId || !movieTitle || !showtime || !showDate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Invalid booking details</h2>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 font-sans text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="rounded-full bg-white/10 text-slate-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-400" />
              <p className="text-sm font-semibold text-slate-300">{city}</p>
            </div>
          </div>
          
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-2xl font-extrabold leading-tight text-transparent lg:text-3xl">
            {movieTitle}
          </h1>
          
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
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

      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <h3 className="text-xl font-bold text-white">Loading Seats...</h3>
              <p className="mt-2 text-slate-400">Please wait while we fetch the seating layout</p>
            </CardContent>
          </Card>
        ) : seatLayout.length === 0 ? (
          <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h3 className="mb-3 text-2xl font-bold text-white">No Seats Available</h3>
              <p className="text-lg text-slate-400">Unable to load seating layout for this show.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Legend */}
            <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Seat Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-500"></div>
                  <span className="text-sm text-slate-300">Regular (₹180)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-500"></div>
                  <span className="text-sm text-slate-300">Royal (₹250)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-blue-500"></div>
                  <span className="text-sm text-slate-300">Executive (₹280)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-yellow-500"></div>
                  <span className="text-sm text-slate-300">Premium (₹350)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-purple-600"></div>
                  <span className="text-sm text-slate-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-500"></div>
                  <span className="text-sm text-slate-300">Booked</span>
                </div>
              </div>
            </Card>

            {/* Screen */}
            <div className="text-center">
              <div className="mx-auto mb-8 h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
              <p className="text-sm font-medium text-slate-400">SCREEN</p>
            </div>

            {/* Seating Layout */}
            <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl p-6">
              <div className="space-y-4">
                {Object.entries(groupSeatsByRow())
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([row, seats]) => (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-8 text-center text-sm font-medium text-slate-400">
                        {row}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {seats.map((seat) => (
                          <button
                            key={seat.seat_number}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.is_booked}
                            className={`h-8 w-8 rounded text-xs font-medium text-white transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 ${getSeatColor(seat)}`}
                            title={`${seat.seat_number} - ${seat.type} - ₹${getSeatPrice(seat.type)}`}
                          >
                            {seat.seat_number.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
              <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl p-6">
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
                    <p className="text-sm text-slate-400">{selectedSeats.length} seat(s)</p>
                    <Button 
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        // Handle booking logic here
                        console.log("Proceeding to payment with:", selectedSeats);
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}