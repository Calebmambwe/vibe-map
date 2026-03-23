export type MoodType = "happy" | "excited" | "calm" | "tired" | "sad" | "angry";

export interface Mood {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  glowColor: string;
}

export interface Vibe {
  id: string;
  mood: MoodType;
  lat: number;
  lng: number;
  timestamp: number;
  city?: string;
  country?: string;
}

export interface VibeStats {
  total: number;
  breakdown: Record<MoodType, number>;
  recentVibes: Vibe[];
}

export const MOODS: Mood[] = [
  { id: "happy", label: "Happy", emoji: "\u{1F60A}", color: "#FFD93D", glowColor: "rgba(255, 217, 61, 0.6)" },
  { id: "excited", label: "Excited", emoji: "\u{1F525}", color: "#FF6B6B", glowColor: "rgba(255, 107, 107, 0.6)" },
  { id: "calm", label: "Calm", emoji: "\u{1F33F}", color: "#6BCB77", glowColor: "rgba(107, 203, 119, 0.6)" },
  { id: "tired", label: "Tired", emoji: "\u{1F634}", color: "#9B59B6", glowColor: "rgba(155, 89, 182, 0.6)" },
  { id: "sad", label: "Sad", emoji: "\u{1F614}", color: "#74B9FF", glowColor: "rgba(116, 185, 255, 0.6)" },
  { id: "angry", label: "Angry", emoji: "\u{1F621}", color: "#E17055", glowColor: "rgba(225, 112, 85, 0.6)" },
];

export function getMood(id: MoodType): Mood {
  const mood = MOODS.find((m) => m.id === id);
  if (!mood) throw new Error(`Unknown mood: ${id}`);
  return mood;
}
