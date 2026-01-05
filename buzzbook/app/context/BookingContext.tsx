"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { route } from "@/lib/api";
import api from "@/lib/interceptor";
import { SelectedSnack } from "../types/snacks";

interface Seat {
  seat_number: string;
  type: string;
  is_booked: boolean;
  is_held: boolean;
  selected_by_me?: boolean;
}

interface HoldPayload {
  theater_id: string;
  movie_title: string;
  showtime: string;
  show_date: string;
  seats: string[];
}
interface HoldSeatsResponse {
  message: string;
  tempBookingId: string;
  seats: string[];
  holdExpiresAt: string;
  seat_price_total: number;
  snacks_total: number;
  total_price: number;
  userId: string;
}
interface updateSeatResponse{
  message:string;
  seats:string[];
  seat_price_total:number,
  snacks_total:number,
  total_price:number,
  hold_expires_at:string,
  tempBookingId:string;
}
// interface seat_Hold {
//   seat_number:string
// }
interface BookingContextType {
  seatLayout: Seat[];
  isLoading: boolean;
  seatPrices: Record<string, number>;
  fetchSeatLayout: (t: string, m: string, s: string, d: string) => Promise<void>;
  holdSeats: (payload: HoldPayload) => Promise<HoldSeatsResponse>;
  updateSeats: (tempBookingId: string, seats: string[], show_date: string) => Promise<updateSeatResponse>;
  updateTempBooking: (tempId: string, snacks: SelectedSnack[]) => Promise<void>;
  releaseHold: (tempId: string) => Promise<void>;
  socket: Socket | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seatPrices, setSeatPrices] = useState<Record<string, number>>({});
  const socketRef = useRef<Socket | null>(null);

  const getCurrentUserId = () => {
    return localStorage.getItem("userId") || null;
  };
  const getCurrentShow = () => {
    try {
      return JSON.parse(localStorage.getItem("currentShowDetails") || "{}");
    } catch {
      return {};
    }
  };

  // SOCKET CONNECTION
  useEffect(() => {
    const socket = io("https://buzzbook-server-dy0q.onrender.com", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("seatHeld", (data) => {
      const currentUserId = getCurrentUserId();
      console.log("🔥 seatHeld event received:", data);
      console.log("👤 Current User:", currentUserId);

      setSeatLayout((prev) =>
        prev.map((s) => {
          if (!data.seats.includes(s.seat_number)) return s;

          console.log("userId", data);
          console.log("CurrentuserId", currentUserId);
          if (data.userId === currentUserId) {
            console.log("🟣 Marking as selected_by_me:", s.seat_number);
            return { ...s, is_held: false, selected_by_me: true };
          }

          console.log("🟡 Marking as held by OTHER user:", s.seat_number);
          return { ...s, is_held: true, selected_by_me: false };
        })
      );
    });

    socket.on("seatReleased", (data) => {
      const currentUserId = getCurrentUserId();
      const show = getCurrentShow();

      console.log("♻️ seatReleased event:", data);

      const eventDate = new Date(data.show_date).toISOString().split("T")[0];
     
      if (
        data.theater_id !== show.theater_id ||
        data.movie_title !== show.movie_title ||
        eventDate !== show.show_date ||
        data.showtime !== show.showtime
      ) {
        return;
      }

      // If backend released MY booking → clear tempBookingId
      if (data.userId === currentUserId) {
        localStorage.removeItem("tempBookingId");
        console.log("🧹 Temp booking cleared (released by backend)");
      }

      // Update UI
      setSeatLayout((prev) =>
        prev.map((s) =>
          data.seats.includes(s.seat_number)
            ? { ...s, is_held: false, selected_by_me: false }
            : s
        )
      );
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  // FETCH SEATS
  const fetchSeatLayout = async (t: string, m: string, s: string, d: string) => {
    setIsLoading(true);
    localStorage.setItem(
      "currentShowDetails",
      JSON.stringify({
        theater_id: t,
        movie_title: m,
        showtime: s,
        show_date: d,
      })
    );
    try {
      const res = await api.get(route.seat, {
        params: {
          theater_id: t,
          movie_title: m,
          showtime: s,
          show_date: d
        }
      });

      const newLayout: Seat[] = res.data.seating_layout.flat();
      setSeatLayout(newLayout);

      setSeatPrices(res.data.prices);
    } finally {
      setIsLoading(false);
    }
  };

  // HOLD SEATS (create temp booking)
  const holdSeats = async (payload: HoldPayload) => {
    const res = await api.post(route.hold, payload, { withCredentials: true });

    // Save tempBookingId locally so we can update later
    if (res?.data?.tempBookingId) {
      localStorage.setItem("tempBookingId", res.data.tempBookingId);
    }

    return res.data;
  };


  // UPDATE SEATS (PUT) -> new API you added
  const updateSeats = async (tempBookingId: string, seats: string[], show_date: string) => {
    const res = await api.put(route.updateSeats, { tempBookingId, seats, show_date });

    // keep tempBookingId persisted
    if (res?.data?.tempBookingId) {
      localStorage.setItem("tempBookingId", res.data.tempBookingId);
    }

    return res.data;
  };


  // UPDATE SNACKS ONLY
  const updateTempBooking = async (tempId: string, snacks: SelectedSnack[]) => {
    await api.put(route.updateTempBooking, {
      tempBookingId: tempId,
      snacks,
    });
  };

  // RELEASE HOLD WHEN USER GOES BACK
  const releaseHold = async (tempId: string) => {
    try {
      await api.post(route.releaseBooking, { tempBookingId: tempId });

      // ✅ Remove saved tempBookingId from localStorage
      const savedId = localStorage.getItem("tempBookingId");
      if (savedId === tempId) {
        localStorage.removeItem("tempBookingId");
      }

    } catch (err) {
      console.error("Error releasing seat hold:", err);
    }
  };


  return (
    <BookingContext.Provider
      value={{
        seatLayout,
        isLoading,
        seatPrices,
        fetchSeatLayout,
        holdSeats,
        updateSeats,
        updateTempBooking,
        releaseHold,
        socket: socketRef.current,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
};
