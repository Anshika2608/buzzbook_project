"use client";

import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import forgot from "@/actions/forgot";
import {
  ForgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validation/ForgotSchema";

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await forgot(data);

    if (res.success) {
      toast.success("Password reset link sent to your email.");
      form.reset();
    } else {
      toast.error(res.error.message || "Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-sm mx-auto p-10 rounded-lg bg-gray-800" >
        {/* Logo same as login */}
        <div className="flex justify-end lg:mr-17">
          <img
            src="/LogoF.png"
            alt="Logo"
            className="h-20 min-h-[5rem] w-auto object-contain"
          />
        </div>

        {/* Heading same style */}
        <h2 className="text-white text-xl font-bold text-center">
          Forgot Password
        </h2>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-lg">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your registered email"
                    className="auth-input pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#372152] text-white hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold"
        >
          Send Reset Link
        </Button>

        {/* Back to login */}
        <h3 className="text-center text-white">
          <Link href="/login">Back to Login</Link>
        </h3>
      </form>
    </Form>
  );
}
