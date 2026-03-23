import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { addVibe, getVibes, getStats } from "@/lib/vibe-store";
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

    // In production, broadcast via Pusher here:
    // await pusher.trigger("vibes", "new-vibe", vibe);

    return NextResponse.json({ success: true, vibe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid vibe data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit vibe" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const vibes = getVibes();
    const stats = getStats();
    return NextResponse.json({ vibes, stats });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vibes" }, { status: 500 });
  }
}
