import { describe, it, expect, vi, afterEach } from "vitest";
import positions from "./fixtures/positions.json";
import helio from "./fixtures/heliocentric.json";
import { normalizePositions, fetchPositions } from "../lib/orreryClient";

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
  it("tolerates a missing/malformed heliocentric payload — helio just comes back empty", () => {
    const p = normalizePositions(positions, null);
    expect(p.geo.length).toBeGreaterThan(0);
    expect(p.helio).toEqual([]);
  });
});

describe("fetchPositions", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("still resolves with geo populated when the heliocentric endpoint 404s (helio is best-effort)", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) {
        return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(positions) } as Response);
    }));

    const p = await fetchPositions({ lat: 23.81, lng: 90.41, label: "Dhaka" });
    expect(p.geo.length).toBeGreaterThan(0);
    expect(p.helio).toEqual([]);
  });

  it("still resolves with geo populated when the heliocentric fetch throws outright", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) {
        return Promise.reject(new Error("network down"));
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(positions) } as Response);
    }));

    const p = await fetchPositions({ lat: 23.81, lng: 90.41, label: "Dhaka" });
    expect(p.geo.length).toBeGreaterThan(0);
    expect(p.helio).toEqual([]);
  });

  it("still throws ApiError when the geocentric fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(helio) } as Response);
      }
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) } as Response);
    }));

    await expect(fetchPositions({ lat: 23.81, lng: 90.41, label: "Dhaka" })).rejects.toThrow(/orrery/i);
  });
});
