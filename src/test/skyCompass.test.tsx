import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkyCompass } from "../components/SkyCompass";
import overview from "./fixtures/overview.json";
import { normalizeOverview } from "../lib/horizonClient";
import type { SunPosition } from "../lib/types";

const o = normalizeOverview(overview);
const sun = (altitude: number, azimuth: number, isUp: boolean): SunPosition => ({
  altitude, azimuth, isUp, time: { iso: "2026-08-01T11:12:00.000Z", time24: "17:12", time12: "5:12 PM" },
});

describe("SkyCompass", () => {
  it("tracks the Sun by day and shows its altitude readout", () => {
    render(<SkyCompass overview={o} sunPosition={sun(34, 258, true)} now={new Date("2026-08-01T11:12:00Z")} />);
    expect(screen.getByText(/now tracking/i)).toBeTruthy();
    expect(screen.getByText(/the Sun/i)).toBeTruthy();
    expect(screen.getAllByText(/34°/).length).toBeGreaterThan(0);
  });

  it("tracks the phase-accurate Moon at night when the Moon is up", () => {
    const moonUp = { ...o, moon: { ...o.moon, position: { ...o.moon.position, altitude: 41 } } };
    render(<SkyCompass overview={moonUp} sunPosition={sun(-10, 300, false)} now={new Date()} />);
    expect(screen.getByText(/the Moon/i)).toBeTruthy();
    expect(screen.getByText(/lit/i)).toBeTruthy();
  });

  it("shows the next body to rise when both are below the horizon", () => {
    const bothDown = { ...o, moon: { ...o.moon, position: { ...o.moon.position, altitude: -30 } } };
    const preDawn = new Date(`${o.sunrise!.iso.slice(0, 10)}T00:30:00Z`);
    render(<SkyCompass overview={bothDown} sunPosition={sun(-20, 300, false)} now={preDawn} />);
    expect(screen.getByText(/next up|resting/i)).toBeTruthy();
  });
});
