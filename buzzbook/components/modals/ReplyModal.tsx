"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ReplyModal({
  open,
  onClose,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (  reply: string ) => Promise<void>;
}) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    await onSubmit({ reply });
    setLoading(false);
    setReply("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Write a Reply</DialogTitle>
        </DialogHeader>

        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your reply..."
          className="bg-slate-800 border-white/10 text-sm"
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? "Posting..." : "Submit Reply"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
