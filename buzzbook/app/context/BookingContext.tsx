"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { route } from "@/lib/api"
import api from "@/lib/interceptor";
interface Seat {
  seat_number: string;
  type: string;
  is_booked: boolean;
  is_held: boolean;
}

interface BookingContextType {
  seatLayout: Seat[];
  isLoading: boolean;
  seatPrices: Record<string, number>;
  fetchSeatLayout: (theaterId: string, movieTitle: string, showtime: string, showDate: string) => Promise<void>;
  holdSeats: (payload: HoldPayload) => Promise<void>;
}

interface HoldPayload {
  theater_id: string;
  movie_title: string;
  showtime: string;
  show_date: string;
  seats: string[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seatPrices, setSeatPrices] = useState<Record<string, number>>({});
  const socketRef = useRef<Socket | null>(null);

  // ✅ Connect to Socket.IO on mount
  useEffect(() => {
    const socket = io("https://buzzbook-server-dy0q.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from Socket.IO server");
    });

    // 🔁 Real-time seat hold updates
    socket.on("seatHeld", (data) => {
      console.log("📩 seatHeld event received:", data);
      // Optionally re-fetch seat layout to update UI
      setSeatLayout((prev) =>
        prev.map((seat) =>
          data.seats.includes(seat.seat_number)
            ? { ...seat, is_held: true }
            : seat
        )
      );
    });

    // 🔁 Real-time confirmed booking updates
    socket.on("seatsBooked", (data) => {
      console.log("🎟️ seatsBooked event received:", data);
      setSeatLayout((prev) =>
        prev.map((seat) =>
          data.bookedSeats.includes(seat.seat_number)
            ? { ...seat, is_booked: true }
            : seat
        )
      );
    });
   //Real time Seat Release Updates
    socket.on("seatReleased", (data) => {
      console.log("♻ seatReleased event:", data);

      setSeatLayout((prev) =>
        prev.map((seat) =>
          data.seats.includes(seat.seat_number)
            ? { ...seat, is_held: false }   // ⭐ un-hold
            : seat
        )
      );
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  // 🎟️ Fetch Seat Layout from API
  const fetchSeatLayout = async (
    theaterId: string,
    movieTitle: string,
    showtime: string,
    showDate: string
  ) => {
    setIsLoading(true);
    try {
      const res = await api.get(
        `${route.seat}`,
        {
          params: {
            theater_id: theaterId,
            movie_title: movieTitle,
            showtime,
            show_date: showDate,
          },
        }
      );
      const layout = res.data.seating_layout?.flat() || [];
      const prices = res.data.prices || {};
      setSeatPrices(prices);
      setSeatLayout(layout);
      console.log("💰 Prices received:", seatPrices);
    } catch (error) {
      console.error("❌ Error fetching seat layout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 💺 Hold Seats (API call triggers backend emit)
  const holdSeats = async (payload: HoldPayload) => {
    try {
      const res = await api.post(
        `${route.hold}`,
        payload,
        { withCredentials: true }
      );
      console.log("✅ Hold seats success:", res.data);
    } catch (error: any) {
      console.error("❌ Error holding seats:", error.response?.data || error.message);
    }
  };

  return (
    <BookingContext.Provider value={{ seatLayout, isLoading, seatPrices, fetchSeatLayout, holdSeats }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return context;
};
