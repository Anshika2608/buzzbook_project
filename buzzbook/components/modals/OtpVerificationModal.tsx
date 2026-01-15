"use client";

import { ShieldCheck } from "lucide-react";
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
import axios from "axios";

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

import api from "@/lib/interceptor";
import { route } from "@/lib/api";
import { z } from "zod";

const OtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof OtpSchema>;

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: () => void;
}

export default function OtpVerificationModal({
  open,
  onOpenChange,
  email,
  onSuccess,
}: OtpVerificationModalProps) {
  const form = useForm<OtpFormData>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      await api.post(
        route.verifyEmail,
        { email, otp: data.otp },
        { withCredentials: true }
      );

      toast.success("Email verified successfully");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response?.data as { message?: string })?.message ||
            "Invalid OTP"
        );
      } else {
        toast.error("Verification failed");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <DialogContent className="w-sm h-72 border-none bg-[#1e1b29] text-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Verify Email
          </DialogTitle>
          <p className="text-center text-sm text-gray-300 mt-1">
            OTP sent to <br />
            <span className="font-semibold">{email}</span>
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg">
                    Enter OTP
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                      <Input
                        type="text"
                        maxLength={6}
                        className="auth-input pl-10 text-center tracking-widest"
                        placeholder="••••••"
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
              Verify OTP
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
