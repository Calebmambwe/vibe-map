import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { addVibe, getVibes, getStats, getActiveCount, trackVisitor } from "@/lib/vibe-store";
import { isRateLimited } from "@/lib/rate-limit";
import type { Vibe } from "@/types/vibe";

const vibeSchema = z.object({
  mood: z.enum(["happy", "excited", "calm", "tired", "sad", "angry"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  city: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Slow down! You can drop a vibe every 30 seconds." },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();
    const parsed = vibeSchema.parse(body);

    const vibe: Vibe = {
      id: `vibe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mood: parsed.mood,
      lat: parsed.lat,
      lng: parsed.lng,
      timestamp: Date.now(),
      city: parsed.city,
      country: parsed.country,
    };

    addVibe(vibe);

    return NextResponse.json({ success: true, vibe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid vibe data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit vibe" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    trackVisitor(ip);

    const vibes = getVibes();
    const stats = getStats();
    const activeVisitors = getActiveCount();
    return NextResponse.json({ vibes, stats, activeVisitors });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vibes" }, { status: 500 });
  }
}
