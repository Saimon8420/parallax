import { describe, it, expect } from "vitest";
import { polarToXY, bandRadii, logRadius, skyPosition } from "../lib/projection";

describe("polarToXY", () => {
  it("0deg points right (east) of center", () => {
    expect(polarToXY(100, 100, 50, 0)).toEqual({ x: 150, y: 100 });
  });
  it("90deg points up (SVG y is inverted)", () => {
    const p = polarToXY(100, 100, 50, 90);
    expect(p.x).toBeCloseTo(100, 6);
    expect(p.y).toBeCloseTo(50, 6);
  });
});

describe("bandRadii", () => {
  it("spreads N bodies evenly between inner and outer", () => {
    expect(bandRadii(3, 10, 90)).toEqual([10, 50, 90]);
  });
  it("single body sits at the midpoint", () => {
    expect(bandRadii(1, 10, 90)).toEqual([50]);
  });
});

describe("logRadius", () => {
  it("nearest distance maps to inner, max to outer", () => {
    expect(logRadius(0, 30, 20, 200)).toBeCloseTo(20, 6);
    expect(logRadius(30, 30, 20, 200)).toBeCloseTo(200, 6);
  });
  it("is monotonic and compresses outer planets", () => {
    const a = logRadius(1, 30, 20, 200);
    const b = logRadius(5, 30, 20, 200);
    const c = logRadius(30, 30, 20, 200);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c - b).toBeLessThan(b - a + 200); // log compression: outer gap not linear
  });
});

describe("skyPosition", () => {
  it("noon-ish high south sun sits near the apex, centered", () => {
    const p = skyPosition(80, 180);
    expect(p.visible).toBe(true);
    expect(p.x).toBeCloseTo(100, 0);      // azimuth 180 -> center
    expect(p.y).toBeLessThan(25);         // high altitude -> near apex
  });
  it("azimuth 90 maps left, 270 maps right", () => {
    expect(skyPosition(10, 90).x).toBeCloseTo(10, 0);
    expect(skyPosition(10, 270).x).toBeCloseTo(190, 0);
  });
  it("below-horizon or behind-the-observer sun is not visible", () => {
    expect(skyPosition(-5, 180).visible).toBe(false);
    expect(skyPosition(10, 20).visible).toBe(false); // azimuth outside [90,270] dome
  });
});
