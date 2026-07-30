import { describe, it, expect } from "vitest";
import overview from "./fixtures/overview.json";
import { normalizeOverview } from "../lib/horizonClient";

describe("normalizeOverview", () => {
  it("flattens sun times + twilight + golden hour", () => {
    const o = normalizeOverview(overview);
    expect(o.sunrise?.time24).toMatch(/^\d{2}:\d{2}$/);
    expect(o.civilDawn).not.toBeUndefined();
    expect(o.goldenEvening).toHaveProperty("start");
  });
  it("maps moon illumination + phase name", () => {
    const o = normalizeOverview(overview);
    expect(o.moon.illuminationFraction).toBeGreaterThanOrEqual(0);
    expect(o.moon.illuminationFraction).toBeLessThanOrEqual(1);
    expect(typeof o.moon.phaseName).toBe("string");
  });
  it("throws on a non-success envelope", () => {
    expect(() => normalizeOverview({ success: false })).toThrow(/horizon/i);
  });
});
