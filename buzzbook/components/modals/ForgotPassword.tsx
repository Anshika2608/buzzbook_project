"use client";

import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

export default function ForgotPasswordModal({ open, onOpenChange }: any) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await forgot(data);

    if (res.success) {
      toast.success("Password reset link sent to your email.");
      form.reset();
      onOpenChange(false);
    } else {
      toast.error(res.error.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <DialogContent className="w-sm h-72 border-none bg-[#1e1b29] text-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Forgot Password
          </DialogTitle>
        </DialogHeader>


        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="auth-input pl-10"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#372152] text-white hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
