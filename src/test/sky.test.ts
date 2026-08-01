import { describe, it, expect } from "vitest";
import {
  compassName, skyTier, skyGradient, skyPlot, humanUntil, describeSky, segmentText,
} from "../lib/sky";
import overview from "./fixtures/overview.json";
import { normalizeOverview } from "../lib/horizonClient";
import type { SunPosition } from "../lib/types";

const o = normalizeOverview(overview);
const sunAt = (altitude: number, azimuth: number, isUp: boolean): SunPosition => ({
  altitude, azimuth, isUp, time: { iso: "2026-08-01T11:12:00.000Z", time24: "17:12", time12: "5:12 PM" },
});

describe("compassName", () => {
  it("names the cardinal and intercardinal points", () => {
    expect(compassName(0)).toBe("north");
    expect(compassName(90)).toBe("east");
    expect(compassName(180)).toBe("south");
    expect(compassName(270)).toBe("west");
  });
  it("names a 16-point direction and wraps past 360", () => {
    expect(compassName(282)).toBe("west-northwest");
    expect(compassName(360 + 45)).toBe("northeast");
    expect(compassName(-90)).toBe("west");
  });
});

describe("skyTier / skyGradient", () => {
  it("classifies day, golden, and night by altitude", () => {
    expect(skyTier(40, true)).toBe("day");
    expect(skyTier(4, true)).toBe("golden");
    expect(skyTier(-10, false)).toBe("night");
  });
  it("returns a distinct gradient string per tier, all with a dark navy top", () => {
    const day = skyGradient(40, true), golden = skyGradient(4, true), night = skyGradient(-10, false);
    expect(day).not.toBe(golden);
    expect(golden).not.toBe(night);
    for (const g of [day, golden, night]) expect(g).toContain("linear-gradient(180deg");
  });
});

describe("skyPlot", () => {
  it("maps east→left, west→right and clamps beyond the dome", () => {
    expect(skyPlot(30, 90).leftPct).toBeLessThan(skyPlot(30, 180).leftPct);
    expect(skyPlot(30, 180).leftPct).toBeLessThan(skyPlot(30, 270).leftPct);
    expect(skyPlot(19, 282).leftPct).toBeLessThanOrEqual(96);
    expect(skyPlot(19, 40).leftPct).toBeGreaterThanOrEqual(4);
  });
  it("puts higher altitude nearer the top (smaller topPct)", () => {
    expect(skyPlot(80, 180).topPct).toBeLessThan(skyPlot(10, 180).topPct);
  });
});

describe("humanUntil", () => {
  const now = new Date("2026-08-01T12:00:00Z");
  it("formats hours and minutes to a future time", () => {
    expect(humanUntil("2026-08-01T13:29:00Z", now)).toBe("1h 29m");
    expect(humanUntil("2026-08-01T12:25:00Z", now)).toBe("25m");
  });
  it("returns null for a past or missing target", () => {
    expect(humanUntil("2026-08-01T11:00:00Z", now)).toBeNull();
    expect(humanUntil(null, now)).toBeNull();
  });
});

describe("describeSky", () => {
  it("says the Sun is setting when it is up, naming the compass direction", () => {
    const { sun } = describeSky(o, sunAt(19, 282, true), new Date(o.sunset!.iso).getTime() > 0 ? new Date("2026-08-01T11:12:00Z") : new Date());
    const text = segmentText(sun);
    expect(text).toMatch(/The Sun hangs 19° over the west-northwest/);
    expect(text).toMatch(/setting (in|at)/);
  });
  it("says it's night when the Sun is down after sunset", () => {
    const late = new Date(new Date(o.sunset!.iso).getTime() + 3_600_000);
    const { sun } = describeSky(o, sunAt(-10, 300, false), late);
    expect(segmentText(sun)).toMatch(/night|rises at/);
  });
  it("describes the moon with an illumination percentage and phase", () => {
    const { moon } = describeSky(o, sunAt(19, 282, true), new Date("2026-08-01T11:12:00Z"));
    expect(segmentText(moon)).toMatch(/\d+%-lit/);
    expect(segmentText(moon)).toMatch(/Moon/);
  });
});
