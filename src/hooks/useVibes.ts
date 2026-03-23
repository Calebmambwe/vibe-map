"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Vibe, VibeStats, MoodType } from "@/types/vibe";

interface UseVibesReturn {
  vibes: Vibe[];
  stats: VibeStats | null;
  submitting: boolean;
  submitVibe: (mood: MoodType, lat: number, lng: number) => Promise<Vibe | null>;
  refreshVibes: () => Promise<void>;
}

export function useVibes(): UseVibesReturn {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [stats, setStats] = useState<VibeStats | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshVibes = useCallback(async () => {
    try {
      const res = await fetch("/api/vibe");
      if (!res.ok) return;
      const data = (await res.json()) as { vibes: Vibe[]; stats: VibeStats };
      setVibes(data.vibes);
      setStats(data.stats);
    } catch {
      // Silently fail on network errors during polling
    }
  }, []);

  useEffect(() => {
    refreshVibes();
    // Poll every 5 seconds for new vibes
    intervalRef.current = setInterval(refreshVibes, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshVibes]);

  const submitVibe = useCallback(
    async (mood: MoodType, lat: number, lng: number): Promise<Vibe | null> => {
      setSubmitting(true);
      try {
        const res = await fetch("/api/vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, lat, lng }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { vibe: Vibe };

        // Optimistically add to local state
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

  return { vibes, stats, submitting, submitVibe, refreshVibes };
}
