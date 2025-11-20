'use client';
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="
      min-h-screen 
      flex flex-col items-center md:items-end justify-center 
      bg-cover bg-center 
      md:bg-[url('/login1.png')] 
      bg-[url('/login2.png')] 
      lg:pr-64
    ">
      <div className="bg-opacity-80 p-8 rounded-lg shadow-lg">
        <LoginForm />
      </div>
    </div>
  );
}
