"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/interceptor";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { route } from "@/lib/api"
// ✅ Define user interface
interface User {
  name: string;
  email: string;
  picture: string | null;
}

// ✅ Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshUser = async () => {
    try {
      const res = await api.get(route.validUser, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser({
          name: res.data.name,
          email: res.data.email,
          picture: res.data.picture || null,
        });
      }
    } catch (error) {
      console.warn("Not authenticated:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    refreshUser();
  }, []);



  const logout = async () => {
    try {
      await api.post(route.logout, {
        withCredentials: true,
      });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
