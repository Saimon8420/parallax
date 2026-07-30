import { describe, it, expect } from "vitest";
import positions from "./fixtures/positions.json";
import helio from "./fixtures/heliocentric.json";
import { normalizePositions } from "../lib/orreryClient";

describe("normalizePositions", () => {
  it("maps geocentric bodies from {data:{bodies}}", () => {
    const p = normalizePositions(positions, helio);
    const sun = p.geo.find((b) => b.key === "sun")!;
    expect(sun.eclipticLongitude).toBeGreaterThanOrEqual(0);
    expect(typeof sun.distanceAu).toBe("number");
    expect(p.geo.some((b) => b.key === "moon")).toBe(true);
  });
  it("maps heliocentric bodies including earth", () => {
    const p = normalizePositions(positions, helio);
    expect(p.helio.some((b) => b.key === "earth")).toBe(true);
  });
  it("throws a typed error on a malformed envelope", () => {
    expect(() => normalizePositions({}, helio)).toThrow(/orrery/i);
  });
});
