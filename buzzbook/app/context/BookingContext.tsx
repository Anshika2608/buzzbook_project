"use client"
// context/BookingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { route } from "@/lib/api";
import { log } from "console";

// Define the shape of your context
interface Seat {
  seat_number: string;
  type: string;
  is_booked: boolean;
}

interface BookingContextType {
  seatLayout: Seat[];
  isLoading: boolean;
 fetchSeatLayout: (theater_id: string, movie_title: string, showtime: string,show_date:string) => Promise<void>;
}

// Create context with default empty values
const BookingContext = createContext<BookingContextType>({
  seatLayout: [],
  isLoading: false,
  fetchSeatLayout: async () => {},
});

// Provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSeatLayout = async (theater_id: string, movie_title: string, showtime: string,show_date:string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${route.seat}`, {
        params: { theater_id, movie_title, showtime,show_date },
      });
      setSeatLayout(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching seating layout", err);
      setSeatLayout([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BookingContext.Provider value={{ seatLayout, isLoading, fetchSeatLayout }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook for easy usage
export const useBooking = () => useContext(BookingContext);
