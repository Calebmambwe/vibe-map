"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Vibe, VibeStats, MoodType } from "@/types/vibe";

interface UseVibesReturn {
  vibes: Vibe[];
  stats: VibeStats | null;
  activeVisitors: number;
  submitting: boolean;
  submitVibe: (mood: MoodType, lat: number, lng: number, city?: string, country?: string) => Promise<Vibe | null>;
  refreshVibes: () => Promise<void>;
}

export function useVibes(): UseVibesReturn {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [stats, setStats] = useState<VibeStats | null>(null);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshVibes = useCallback(async () => {
    try {
      const res = await fetch("/api/vibe");
      if (!res.ok) return;
      const data = (await res.json()) as { vibes: Vibe[]; stats: VibeStats; activeVisitors: number };
      setVibes(data.vibes);
      setStats(data.stats);
      setActiveVisitors(data.activeVisitors || 0);
    } catch {
      // Silently fail on network errors during polling
    }
  }, []);

  useEffect(() => {
    refreshVibes();
    intervalRef.current = setInterval(refreshVibes, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshVibes]);

  const submitVibe = useCallback(
    async (mood: MoodType, lat: number, lng: number, city?: string, country?: string): Promise<Vibe | null> => {
      setSubmitting(true);
      try {
        const res = await fetch("/api/vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, lat, lng, city, country }),
        });
        if (!res.ok) {
          const errorData = (await res.json()) as { error?: string };
          if (res.status === 429) {
            alert(errorData.error || "Too many vibes! Wait a moment.");
          }
          return null;
        }
        const data = (await res.json()) as { vibe: Vibe };
        setVibes((prev) => [data.vibe, ...prev]);
        await refreshVibes();
        return data.vibe;
      } catch {
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshVibes],
  );

  return { vibes, stats, activeVisitors, submitting, submitVibe, refreshVibes };
}
