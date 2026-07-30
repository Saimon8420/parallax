import { describe, it, expect } from "vitest";
import overview from "./fixtures/overview.json";
import sunPosition from "./fixtures/sun-position.json";
import moonPhases from "./fixtures/moon-phases.json";
import calendar from "./fixtures/calendar.json";
import {
  normalizeOverview,
  normalizeSunPosition,
  normalizeMoonPhases,
  normalizeCalendar,
} from "../lib/horizonClient";

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
  it("exposes nautical/astro twilight and moon.position", () => {
    const o = normalizeOverview(overview);
    expect(o.twilight.nauticalDawn?.time24).toMatch(/^\d{2}:\d{2}$/);
    expect(o.twilight.astroDusk?.time24).toMatch(/^\d{2}:\d{2}$/);
    expect(o.twilight.civilDawn).not.toBeNull();
    expect(typeof o.moon.position.distanceKm).toBe("number");
    expect(o.moon.position.distanceKm).toBeGreaterThan(0);
  });
});

describe("normalizeSunPosition", () => {
  it("flattens azimuth/altitude/isUp/time", () => {
    const s = normalizeSunPosition(sunPosition);
    expect(typeof s.azimuth).toBe("number");
    expect(typeof s.altitude).toBe("number");
    expect(typeof s.isUp).toBe("boolean");
    expect(s.time.time24).toMatch(/^\d{2}:\d{2}$/);
  });
  it("throws on a non-success envelope", () => {
    expect(() => normalizeSunPosition({ success: false })).toThrow(/horizon/i);
  });
});

describe("normalizeMoonPhases", () => {
  it("maps phases and dedupes events within 6h of the same phase", () => {
    const phases = normalizeMoonPhases(moonPhases);
    expect(phases.length).toBeLessThanOrEqual((moonPhases as any).data.phases.length);
    expect(phases.length).toBeLessThan((moonPhases as any).data.phases.length);
    for (const p of phases) {
      expect(p).toHaveProperty("phase");
      expect(p).toHaveProperty("utcISO");
      expect(p).toHaveProperty("dateLabel");
    }
    // No adjacent duplicate phase on the same dateLabel survives the dedupe.
    for (let i = 1; i < phases.length; i++) {
      const prev = phases[i - 1], cur = phases[i];
      const sameDay = prev.dateLabel === cur.dateLabel && prev.phase === cur.phase;
      expect(sameDay).toBe(false);
    }
  });
});

describe("normalizeCalendar", () => {
  it("maps year/month and one day per day-of-month", () => {
    const c = normalizeCalendar(calendar);
    expect(c.year).toBe(2026);
    expect(c.month).toBe(7);
    expect(c.days.length).toBe(31);
    for (const d of c.days) {
      expect(typeof d.moonPhase).toBe("string");
      expect(typeof d.moonIllumination).toBe("number");
    }
  });
});
