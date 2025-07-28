'use client'
import LoginForm from "@/components/forms/LoginForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
  return (
    <div className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <LoginForm />
      <Button onClick={()=>router.push('/forgot')}>Fogot Password</Button>
    </div>
  );
}