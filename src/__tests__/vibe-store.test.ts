import { describe, it, expect, beforeEach } from "vitest";

// Re-import to get fresh module state per test file
// Note: vibe-store has module-level state with seeds, so we test additive behavior
describe("vibe-store", () => {
  it("should export required functions", async () => {
    const store = await import("@/lib/vibe-store");
    expect(typeof store.addVibe).toBe("function");
    expect(typeof store.getVibes).toBe("function");
    expect(typeof store.getStats).toBe("function");
    expect(typeof store.trackVisitor).toBe("function");
    expect(typeof store.getActiveCount).toBe("function");
  });

  it("should have seeded vibes on initialization", async () => {
    const store = await import("@/lib/vibe-store");
    const vibes = store.getVibes();
    expect(vibes.length).toBeGreaterThanOrEqual(15);
  });

  it("should add a new vibe", async () => {
    const store = await import("@/lib/vibe-store");
    const beforeCount = store.getVibes().length;

    store.addVibe({
      id: "test-vibe-1",
      mood: "happy",
      lat: 0,
      lng: 0,
      timestamp: Date.now(),
    });

    expect(store.getVibes().length).toBe(beforeCount + 1);
    expect(store.getVibes()[0].id).toBe("test-vibe-1");
  });

  it("getStats should return correct breakdown", async () => {
    const store = await import("@/lib/vibe-store");
    const stats = store.getStats();

    expect(stats.total).toBeGreaterThan(0);
    expect(stats.breakdown).toHaveProperty("happy");
    expect(stats.breakdown).toHaveProperty("excited");
    expect(stats.breakdown).toHaveProperty("calm");
    expect(stats.breakdown).toHaveProperty("tired");
    expect(stats.breakdown).toHaveProperty("sad");
    expect(stats.breakdown).toHaveProperty("angry");
    expect(stats.recentVibes.length).toBeLessThanOrEqual(10);

    // Total should equal sum of breakdown
    const sum = Object.values(stats.breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(stats.total);
  });

  it("trackVisitor and getActiveCount should work", async () => {
    const store = await import("@/lib/vibe-store");
    store.trackVisitor("test-ip-1");
    store.trackVisitor("test-ip-2");

    const count = store.getActiveCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
