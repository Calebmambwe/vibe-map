"use client";

import { motion } from "framer-motion";
import { Share2, X } from "lucide-react";
import { getMood } from "@/types/vibe";
import type { Vibe } from "@/types/vibe";
import { scaleIn } from "@/lib/animations";

interface ShareCardProps {
  vibe: Vibe;
  onClose: () => void;
}

export function ShareCard({ vibe, onClose }: ShareCardProps) {
  const mood = getMood(vibe.mood);
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const ogUrl = `${shareUrl}/api/og?mood=${vibe.mood}&city=${encodeURIComponent(vibe.city || "Somewhere")}&country=${encodeURIComponent(vibe.country || "Earth")}`;
  const shareText = `${mood.emoji} I'm feeling ${mood.label} from ${vibe.city || "Somewhere"}! Drop your vibe on the globe:`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "VibeMap — Drop Your Vibe",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${mood.color}15, #0f0c29, ${mood.color}10)`,
          border: `1px solid ${mood.color}30`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-4 p-8">
          <span className="text-6xl">{mood.emoji}</span>
          <h3 className="text-2xl font-bold" style={{ color: mood.color }}>
            Feeling {mood.label}
          </h3>
          <p className="text-sm text-white/60">
            from {vibe.city || "Somewhere"}, {vibe.country || "Earth"}
          </p>

          {/* OG Preview */}
          <div className="w-full overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogUrl}
              alt="Vibe card preview"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-all hover:scale-105"
            style={{ backgroundColor: mood.color }}
          >
            <Share2 size={18} />
            Share Your Vibe
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
