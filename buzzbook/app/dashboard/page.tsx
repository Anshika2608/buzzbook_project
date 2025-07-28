"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/?redirected=unauthorised");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      {user.picture && (
        <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full" />
      )}
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
