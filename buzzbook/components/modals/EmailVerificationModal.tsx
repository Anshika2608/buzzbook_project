"use client";

import { useState} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/interceptor";
import { route } from "@/lib/api";

interface Props {
  open: boolean;
  email: string;
  onOpenChange: (open: boolean) => void;
  onOtpSent: () => void;
}

export default function EmailVerificationRequired({
  open,
  email,
  onOpenChange,
  onOtpSent,
}: Props) {
  const [loading, setLoading] = useState(false);
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await api.post(route.resendOtp, { email });
      toast.success("OTP sent to your email");
      onOtpSent();
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1b29] text-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Email Verification Required</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-300">
          Your email is not verified. Please verify to continue.
        </p>

        <Input value={email} disabled />

        <Button
          onClick={handleSendOtp}
          disabled={loading}
          className="w-full mt-4 bg-[#372152]"
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
