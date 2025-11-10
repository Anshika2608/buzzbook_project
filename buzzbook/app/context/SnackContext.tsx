"use client";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

interface SnackOption {
  unit: string;
  price: number;
  _id: string;
}

interface Snack {
  _id: string;
  name: string;
  snack_img: string[];
  description: string;
  available: boolean;
  category: string;
  rating: number;
  quantity_options: SnackOption[];
}

interface SnackContextType {
  snacks: Snack[];
  isLoading: boolean;
  fetchSnacks: (theaterId: string) => Promise<void>;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

export const SnackProvider = ({ children }: { children: React.ReactNode }) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSnacks = async (theaterId: string) => {
  if (!theaterId) return console.error("❌ Missing theatreId for snacks fetch!");

  const token = localStorage.getItem("token"); 

  setIsLoading(true);

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API}snack/snack_list/${theaterId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Optional: send cookies too if required
      }
    );

    setSnacks(res.data?.snacks || []);
    console.log("✅ Snacks fetched successfully:", res.data.snacks);
  } catch (err) {
    console.error("❌ Error fetching snacks:", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <SnackContext.Provider value={{ snacks, isLoading, fetchSnacks }}>
      {children}
    </SnackContext.Provider>
  );
};

export const useSnacks = () => {
  const context = useContext(SnackContext);
  if (!context) throw new Error("useSnacks must be used inside SnackProvider");
  return context;
};
