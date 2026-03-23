import { describe, it, expect } from "vitest";
import { MOODS, getMood } from "@/types/vibe";
import type { MoodType } from "@/types/vibe";

describe("vibe types", () => {
  it("should have exactly 6 moods", () => {
    expect(MOODS).toHaveLength(6);
  });

  it("each mood should have required fields", () => {
    for (const mood of MOODS) {
      expect(mood.id).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.emoji).toBeTruthy();
      expect(mood.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(mood.glowColor).toMatch(/^rgba\(/);
    }
  });

  it("getMood should return correct mood", () => {
    const happy = getMood("happy");
    expect(happy.label).toBe("Happy");
    expect(happy.emoji).toBe("\u{1F60A}");
  });

  it("getMood should throw for unknown mood", () => {
    expect(() => getMood("unknown" as MoodType)).toThrow("Unknown mood");
  });

  it("all mood IDs should be unique", () => {
    const ids = MOODS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
