"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getSocket } from "@/app/socket";

type Stats = {
  totalMovies: number;
  totalTheaters: number;
  totalBookings: number;
  totalSnacks: number;
  totalUsers: number;
  totalRevenue: number;
};

type StatsContextType = {
  stats: Stats | null;
  loading: boolean;
  fetchStats: () => Promise<void>;
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/get_stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // connect socket
    const socket = getSocket();

    socket.on("statsUpdated", (newStats: Stats) => {
      setStats(newStats);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
};
