"use client";

import { useSyncExternalStore, useCallback } from "react";

const STREAK_KEY = "vibemap-streak";
const LAST_VIBE_KEY = "vibemap-last-vibe-date";

interface StreakData {
  streak: number;
  lastVibeDate: string;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadStreak(): StreakData {
  if (typeof window === "undefined") return { streak: 0, lastVibeDate: "" };
  try {
    const streak = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
    const lastVibeDate = localStorage.getItem(LAST_VIBE_KEY) || "";
    return { streak, lastVibeDate };
  } catch {
    return { streak: 0, lastVibeDate: "" };
  }
}

function saveStreak(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, String(data.streak));
    localStorage.setItem(LAST_VIBE_KEY, data.lastVibeDate);
  } catch {
    // localStorage not available
  }
}

let streakSnapshot = 0;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): number {
  return streakSnapshot;
}

function getServerSnapshot(): number {
  return 0;
}

function initStreak() {
  if (typeof window !== "undefined") {
    streakSnapshot = loadStreak().streak;
  }
}
initStreak();

export function useVibeStreak() {
  const streak = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const recordVibe = useCallback(() => {
    const today = getToday();
    const data = loadStreak();

    if (data.lastVibeDate === today) {
      return data.streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const newStreak = data.lastVibeDate === yesterdayStr ? data.streak + 1 : 1;
    saveStreak({ streak: newStreak, lastVibeDate: today });
    streakSnapshot = newStreak;
    for (const cb of listeners) cb();
    return newStreak;
  }, []);

  return { streak, recordVibe };
}
