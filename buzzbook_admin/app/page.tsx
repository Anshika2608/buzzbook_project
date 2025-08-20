"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
      <h1 className="text-4xl font-bold text-center">Welcome to BuzzBook Admin</h1>
      <p className="text-lg text-center text-gray-600">Your smart event & ticketing platform</p>

      <div className="flex space-x-4">
        <Button onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
      </div>
    </div>
  );
}


