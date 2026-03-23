import type { Vibe, VibeStats, MoodType } from "@/types/vibe";

// In-memory store for demo mode (no Redis required)
// In production, replace with Upstash Redis
const vibes: Vibe[] = [];
const MAX_VIBES = 500;

// Seed with some initial vibes for visual interest
const SEED_LOCATIONS = [
  { lat: 40.7128, lng: -74.006, city: "New York", country: "US" },
  { lat: 51.5074, lng: -0.1278, city: "London", country: "GB" },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "JP" },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "AU" },
  { lat: 48.8566, lng: 2.3522, city: "Paris", country: "FR" },
  { lat: -15.3875, lng: 28.3228, city: "Lusaka", country: "ZM" },
  { lat: 55.7558, lng: 37.6173, city: "Moscow", country: "RU" },
  { lat: -23.5505, lng: -46.6333, city: "Sao Paulo", country: "BR" },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", country: "SG" },
  { lat: 37.5665, lng: 126.978, city: "Seoul", country: "KR" },
  { lat: 28.6139, lng: 77.209, city: "Delhi", country: "IN" },
  { lat: 30.0444, lng: 31.2357, city: "Cairo", country: "EG" },
  { lat: -1.2921, lng: 36.8219, city: "Nairobi", country: "KE" },
  { lat: 6.5244, lng: 3.3792, city: "Lagos", country: "NG" },
  { lat: 19.4326, lng: -99.1332, city: "Mexico City", country: "MX" },
];

const MOOD_IDS: MoodType[] = ["happy", "excited", "calm", "tired", "sad", "angry"];

function seedVibes() {
  if (vibes.length > 0) return;
  const now = Date.now();
  for (const loc of SEED_LOCATIONS) {
    const mood = MOOD_IDS[Math.floor(Math.random() * MOOD_IDS.length)];
    vibes.push({
      id: `seed-${loc.city}`,
      mood,
      lat: loc.lat + (Math.random() - 0.5) * 2,
      lng: loc.lng + (Math.random() - 0.5) * 2,
      timestamp: now - Math.floor(Math.random() * 3600000),
      city: loc.city,
      country: loc.country,
    });
  }
}

seedVibes();

export function addVibe(vibe: Vibe): void {
  vibes.unshift(vibe);
  if (vibes.length > MAX_VIBES) {
    vibes.pop();
  }
}

export function getVibes(): Vibe[] {
  return [...vibes];
}

export function getStats(): VibeStats {
  const breakdown: Record<MoodType, number> = {
    happy: 0,
    excited: 0,
    calm: 0,
    tired: 0,
    sad: 0,
    angry: 0,
  };

  for (const vibe of vibes) {
    breakdown[vibe.mood]++;
  }

  return {
    total: vibes.length,
    breakdown,
    recentVibes: vibes.slice(0, 10),
  };
}
