"use client";

import { motion } from "framer-motion";
import { MOODS } from "@/types/vibe";
import type { VibeStats as VibeStatsType } from "@/types/vibe";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface VibeStatsProps {
  stats: VibeStatsType | null;
}

export function VibeStatsPanel({ stats }: VibeStatsProps) {
  if (!stats) return null;

  const maxCount = Math.max(...Object.values(stats.breakdown), 1);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeInUp} className="text-center">
        <p className="text-3xl font-bold text-white">{stats.total.toLocaleString()}</p>
        <p className="text-xs text-white/50">vibes dropped</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">Global Mood</p>
        {MOODS.map((mood) => {
          const count = stats.breakdown[mood.id] || 0;
          const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={mood.id} className="flex items-center gap-2">
              <span className="w-6 text-center text-sm">{mood.emoji}</span>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-xs text-white/50">{pct}%</span>
            </div>
          );
        })}
      </motion.div>

      {stats.recentVibes.length > 0 && (
        <motion.div variants={fadeInUp} className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Recent Vibes</p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {stats.recentVibes.slice(0, 5).map((vibe) => {
              const mood = MOODS.find((m) => m.id === vibe.mood);
              if (!mood) return null;
              const timeAgo = getTimeAgo(vibe.timestamp);
              return (
                <div
                  key={vibe.id}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs"
                >
                  <span>{mood.emoji}</span>
                  <span className="flex-1 text-white/70">
                    {vibe.city || "Somewhere"}
                  </span>
                  <span className="text-white/30">{timeAgo}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
