import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { MOODS } from "@/types/vibe";
import type { MoodType } from "@/types/vibe";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mood = (searchParams.get("mood") || "happy") as MoodType;
  const city = searchParams.get("city") || "Somewhere";
  const country = searchParams.get("country") || "Earth";

  const moodData = MOODS.find((m) => m.id === mood) || MOODS[0];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "96px", display: "flex" }}>{moodData.emoji}</div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: moodData.color,
              display: "flex",
            }}
          >
            Feeling {moodData.label}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.7)",
              display: "flex",
            }}
          >
            from {city}, {country}
          </div>
          <div
            style={{
              marginTop: "32px",
              fontSize: "24px",
              color: "rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ display: "flex" }}>🌍</span>
            <span style={{ display: "flex" }}>vibemap.app</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
