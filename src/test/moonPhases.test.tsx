import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MoonPhases } from "../components/MoonPhases";

describe("MoonPhases", () => {
  it("shows the phase label, date, and days-until countdown", () => {
    render(
      <MoonPhases
        phases={[{ phase: "Full Moon", utcISO: "2026-08-09T00:00:00Z", dateLabel: "2026-08-09" }]}
        now={new Date("2026-08-04T00:00:00Z")}
      />,
    );
    expect(screen.getByText(/Full Moon/)).toBeTruthy();
    expect(screen.getByText(/2026-08-09/)).toBeTruthy();
    expect(screen.getByText(/in 5 days/)).toBeTruthy();
  });

  it("shows the singular 'in 1 day' (not 'in 1 days') for an event a day out", () => {
    render(
      <MoonPhases
        phases={[{ phase: "Last Quarter", utcISO: "2026-08-05T00:00:00Z", dateLabel: "2026-08-05" }]}
        now={new Date("2026-08-04T00:00:00Z")}
      />,
    );
    expect(screen.getByText(/in 1 day\b/)).toBeTruthy();
    expect(screen.queryByText(/in 1 days/)).toBeNull();
  });

  it("shows 'today' when dateLabel matches now's UTC calendar date", () => {
    render(
      <MoonPhases
        phases={[{ phase: "New Moon", utcISO: "2026-08-12T06:00:00Z", dateLabel: "2026-08-12" }]}
        now={new Date("2026-08-12T02:00:00Z")}
      />,
    );
    expect(screen.getByText(/New Moon/)).toBeTruthy();
    expect(screen.getByText(/today/)).toBeTruthy();
  });

  it("does NOT show 'today' for an event <12h away that falls on the next calendar date", () => {
    render(
      <MoonPhases
        phases={[{ phase: "First Quarter", utcISO: "2026-08-13T02:00:00Z", dateLabel: "2026-08-13" }]}
        now={new Date("2026-08-12T20:00:00Z")}
      />,
    );
    expect(screen.getByText(/First Quarter/)).toBeTruthy();
    expect(screen.queryByText(/today/)).toBeNull();
    expect(screen.getByText(/in 1 day\b/)).toBeTruthy();
  });
});
