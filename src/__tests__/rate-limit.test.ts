import { describe, it, expect } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

describe("rate-limit", () => {
  it("should allow first request", () => {
    const ip = `test-${Date.now()}-1`;
    expect(isRateLimited(ip)).toBe(false);
  });

  it("should allow second request within window", () => {
    const ip = `test-${Date.now()}-2`;
    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(false);
  });

  it("should block third request within window", () => {
    const ip = `test-${Date.now()}-3`;
    expect(isRateLimited(ip)).toBe(false); // 1st
    expect(isRateLimited(ip)).toBe(false); // 2nd
    expect(isRateLimited(ip)).toBe(true);  // 3rd — blocked
  });

  it("should track different IPs independently", () => {
    const ip1 = `test-${Date.now()}-4a`;
    const ip2 = `test-${Date.now()}-4b`;

    expect(isRateLimited(ip1)).toBe(false);
    expect(isRateLimited(ip1)).toBe(false);
    expect(isRateLimited(ip1)).toBe(true); // ip1 blocked

    expect(isRateLimited(ip2)).toBe(false); // ip2 still allowed
  });
});
