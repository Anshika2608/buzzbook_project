"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginRequiredModal({
  open,
  onOpenChange,
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onOpenChange(false);
    router.push(
      `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <DialogContent className="w-sm h-64 border-none bg-[#1e1b29] text-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Login Required
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-gray-300">
            Please login to add movies to your wishlist
          </p>

          <Button
            variant="secondary"
            onClick={handleLoginRedirect}
            className="w-full bg-[#372152] text-white hover:bg-[#7554a1] font-bold cursor-pointer"
          >
            Login Now
          </Button>

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-gray-400  cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
