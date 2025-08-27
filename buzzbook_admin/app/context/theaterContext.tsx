"use client";
import { useEffect, useState, useContext, createContext, ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { getSocket } from "../socket";

type Seat = {
  seat_number?: string;
  type: string;
  is_booked?: boolean;
  is_held?: boolean;
  hold_expires_at?: Date | null;
};

type Showtime = {
  time: string;
  audi_number: string;
  prices: {
    VIP?: number;
    Premium?: number;
    Regular?: number;
    Sofa?: number;
    Recliner?: number;
  };
};

type Film = {
  title: string;
  language: string;
  showtimes: Showtime[];
};
type Audi = {
  audi_number: string;
  layout_type: string;
  rows: number;
  seatsPerRow: number;
  seating_capacity: number;
  seating_layout: Seat[][];
  vipRows?: number;
  premiumRows?: number;
  sofaRows?: number;
  regularRows?: number;
  reclinerRows?: number;
  emptySpaces?: string[];
  films_showing: Film[];
};

type Theater = {
  _id: string;
  theater_id: string;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  address: string;
  popular: boolean;
  contact: string;
  audis: Audi[];
};

type TheaterContextType = {
  theaters: Theater[];
  loading: boolean;
  error: string | null;
  fetchTheaters: () => Promise<void>;
};

const TheaterContext = createContext<TheaterContextType | null>(null);

export function TheaterProvider({ children }: { children: ReactNode }) {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const Api_url="http://localhost:5000"
  const fetchTheaters = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${Api_url}/theater/theater_list`); 
      setTheaters(data.theaters || []);
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      setError(e.response?.data?.message || "Failed to fetch theaters");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchTheaters();
    // const socket = getSocket();
    // socket.on("statsUpdated", (update) => {
    //   if (update.type === "theater") {
    //     setTheaters((prev) => [...prev, update.data]);
    //   }
    // });
    // return () => {
    //   socket.off("statsUpdated");
    // };
  }, []);

  return (
    <TheaterContext.Provider
      value={{
        theaters,
        loading,
        error,
        fetchTheaters
      }}
    >
      {children}
    </TheaterContext.Provider>
  );
}

export function useTheaters() {
  const ctx = useContext(TheaterContext);
  if (!ctx) throw new Error("useTheaters must be used within TheaterProvider");
  return ctx;
}
