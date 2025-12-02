"use client";

import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { MessageCircle } from "lucide-react";
import ReplyModal from "@/components/modals/ReplyModal"; 

type Reply = {
  _id: string;
  reply: string;
  created_at?: string;
  userName?: string;
};

export default function ReplyThread({
  movieId,
  reviewId,
  getReplies,
  postReply,
}: {
  movieId: string;
  reviewId: string;
  getReplies: (movieId: string, reviewId: string) => Promise<Reply[]>;
  postReply: (movieId: string, reviewId: string, reply: string) => Promise<void>;
}) {
  
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);

  const loadReplies = async () => {
    setLoading(true);
    try {
      const res = await getReplies(movieId, reviewId);
      setReplies(res || []);
    } catch (err) {
      console.error("❌ Error loading replies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReplies();
  }, [movieId, reviewId]);

  const handleSubmitReply = async (data: { reply: string }) => {
    await postReply(movieId, reviewId, data.reply); // ✔ send only string
    await loadReplies();
  };

  return (
    <div className="mt-3 space-y-4 ml-10">

      {/* Reply Button (opens modal) */}
      <button
        className="text-xs text-purple-300 hover:text-purple-200 underline"
        onClick={() => setOpenReplyModal(true)}
      >
        Reply
      </button>

      {/* Replies List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading replies...</p>
      ) : replies.length === 0 ? (
        <p className="text-sm text-gray-400">No replies yet.</p>
      ) : (
        replies.map((rep) => (
          <div
            key={rep._id}
            className="p-3 bg-slate-800/50 rounded-xl border border-white/10 flex gap-3"
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-600/20">
              <MessageCircle className="h-4 w-4 text-purple-300" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {rep.userName || "User"}
                </span>
                <span className="text-xs text-gray-400">
                  {rep.created_at ? format(rep.created_at) : ""}
                </span>
              </div>

              <div className="text-sm text-gray-300 mt-1">{rep.reply}</div>
            </div>
          </div>
        ))
      )}

      {/* Reply Modal */}
      <ReplyModal
        open={openReplyModal}
        onClose={() => setOpenReplyModal(false)}
        onSubmit={handleSubmitReply}
      />
    </div>
  );
}
