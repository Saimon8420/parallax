import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MySky } from "../components/MySky";
import { MoonGlyph } from "../components/MoonGlyph";
import overview from "./fixtures/overview.json";
import { normalizeOverview } from "../lib/horizonClient";

const o = normalizeOverview(overview);

describe("MySky", () => {
  it("shows sunrise and sunset times", () => {
    render(<MySky overview={o} />);
    if (o.sunrise) expect(screen.getByText(o.sunrise.time24)).toBeTruthy();
    if (o.sunset) expect(screen.getByText(o.sunset.time24)).toBeTruthy();
  });
  it("shows the moon phase name", () => {
    render(<MySky overview={o} />);
    expect(screen.getByText(new RegExp(o.moon.phaseName, "i"))).toBeTruthy();
  });
  it("handles polar null sunrise honestly", () => {
    render(<MySky overview={{ ...o, sunrise: null, sunset: null }} />);
    expect(screen.getByText(/no sunrise|sun (up|down) all day/i)).toBeTruthy();
  });
});

describe("MoonGlyph", () => {
  it("shifts the dark overlay further clear of the disk as illumination increases", () => {
    const { container: full } = render(<MoonGlyph fraction={1} phaseName="Full Moon" />);
    const { container: newMoon } = render(<MoonGlyph fraction={0} phaseName="New Moon" />);
    // Second <circle> in each SVG is the fill-ground overlay disk.
    const fullCx = Number(full.querySelectorAll("circle")[1].getAttribute("cx"));
    const newCx = Number(newMoon.querySelectorAll("circle")[1].getAttribute("cx"));
    expect(fullCx).toBeGreaterThan(newCx);
  });

  it("renders moonrise/moonset as HH:MM from .time24 (fix #4)", () => {
    render(
      <MoonGlyph
        fraction={0.5} phaseName="First Quarter"
        rise={{ iso: "2026-07-30T20:15:00.000Z", time24: "20:15", time12: "8:15 PM" }}
        set={{ iso: "2026-07-31T05:30:00.000Z", time24: "05:30", time12: "5:30 AM" }}
        alwaysUp={false} alwaysDown={false}
      />,
    );
    expect(screen.getByText(/20:15/)).toBeTruthy();
    expect(screen.getByText(/05:30/)).toBeTruthy();
  });

  it("shows a dash for a null moonrise/moonset time", () => {
    render(
      <MoonGlyph
        fraction={0.5} phaseName="First Quarter"
        rise={null}
        set={{ iso: "2026-07-31T05:30:00.000Z", time24: "05:30", time12: "5:30 AM" }}
        alwaysUp={false} alwaysDown={false}
      />,
    );
    expect(screen.getByText(/—/)).toBeTruthy();
    expect(screen.getByText(/05:30/)).toBeTruthy();
  });

  it("says 'up all day' when alwaysUp", () => {
    render(<MoonGlyph fraction={1} phaseName="Full Moon" alwaysUp={true} />);
    expect(screen.getByText(/up all day/i)).toBeTruthy();
  });

  it("says 'down all day' when alwaysDown", () => {
    render(<MoonGlyph fraction={0} phaseName="New Moon" alwaysDown={true} />);
    expect(screen.getByText(/down all day/i)).toBeTruthy();
  });
});
