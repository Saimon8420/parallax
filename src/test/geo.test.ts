import { describe, it, expect, beforeEach } from "vitest";
import { searchCities, saveLocation, loadLocation, DEFAULT_LOCATION } from "../lib/geo";

describe("searchCities", () => {
  it("finds a city case-insensitively by prefix", () => {
    const r = searchCities("dha");
    expect(r[0].label.toLowerCase()).toContain("dhaka");
  });
  it("returns [] for empty query", () => {
    expect(searchCities("")).toEqual([]);
  });
  it("respects the limit", () => {
    expect(searchCities("a", 3).length).toBeLessThanOrEqual(3);
  });
});

describe("location persistence", () => {
  beforeEach(() => localStorage.clear());
  it("round-trips through localStorage", () => {
    saveLocation(DEFAULT_LOCATION);
    expect(loadLocation()).toEqual(DEFAULT_LOCATION);
  });
  it("returns null when nothing saved", () => {
    expect(loadLocation()).toBeNull();
  });
});
