"use client";
import React, { createContext, useContext, useState } from "react";
import api from "@/lib/interceptor";
import { route } from "@/lib/api"
import { Snack } from "../types/snacks";


interface SnackContextType {
  snacks: Snack[];
  isLoading: boolean;
  hasFetched: boolean;
  requestedTheaterId: string | null;
  fetchedTheaterId: string | null;
  fetchSnacks: (theaterId: string) => Promise<void>;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

export const SnackProvider = ({ children }: { children: React.ReactNode }) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestedTheaterId, setRequestedTheaterId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedTheaterId, setFetchedTheaterId] = useState<string | null>(null);

  const fetchSnacks = async (theaterId: string) => {
    if (!theaterId) {
      console.error(" Missing theatreId for snacks fetch!");
      return;
    }

    setRequestedTheaterId(theaterId);
    setIsLoading(true);
    setHasFetched(false);
    setSnacks([]);
    setFetchedTheaterId(null);

    try {
      const res = await api.get(`${route.snacks}${theaterId}`);

      setSnacks(res.data?.snacks || []);
      setFetchedTheaterId(theaterId);
    } catch (err) {
      console.error("Error fetching snacks:", err);
      setSnacks([]);
      setFetchedTheaterId(theaterId);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };


  return (
    <SnackContext.Provider value={{ snacks, requestedTheaterId, fetchedTheaterId, isLoading, hasFetched, fetchSnacks }}>
      {children}
    </SnackContext.Provider>
  );
};

export const useSnacks = () => {
  const context = useContext(SnackContext);
  if (!context) throw new Error("useSnacks must be used inside SnackProvider");
  return context;
};
