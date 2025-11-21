"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { critic_name: string; rating: number; review: string }) => void;
}

export default function ReviewModal({ open, onClose, onSubmit }: ReviewModalProps) {
  const [criticName, setCriticName] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    onSubmit({
      critic_name: criticName,
      rating,
      review,
    });
    setCriticName("");
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-300">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-4 mt-4">
          {/* Critic Name */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Your Name</label>
            <Input
              value={criticName}
              onChange={(e) => setCriticName(e.target.value)}
              placeholder="Enter your name"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-6 w-6 cursor-pointer transition 
                  ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Your Review</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts..."
              className="bg-slate-800 border-slate-700 text-white resize-none"
            />
          </div>

          {/* Submit */}
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
