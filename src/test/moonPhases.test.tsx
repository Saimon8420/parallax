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

  it("shows 'today' when the phase falls on the same day as now", () => {
    render(
      <MoonPhases
        phases={[{ phase: "New Moon", utcISO: "2026-08-04T06:00:00Z", dateLabel: "2026-08-04" }]}
        now={new Date("2026-08-04T00:00:00Z")}
      />,
    );
    expect(screen.getByText(/New Moon/)).toBeTruthy();
    expect(screen.getByText(/today/)).toBeTruthy();
  });
});
