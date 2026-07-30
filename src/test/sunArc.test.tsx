import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SunArc } from "../components/SunArc";
import overview from "./fixtures/overview.json";
import { normalizeOverview } from "../lib/horizonClient";

const o = normalizeOverview(overview);

describe("SunArc", () => {
  it("renders the live accent sun dot and alt/az/up readout when sunPosition is visible", () => {
    const { container } = render(
      <SunArc
        overview={o}
        sunPosition={{
          azimuth: 255,
          altitude: 73,
          isUp: true,
          time: { iso: "2026-07-30T13:14:00.000Z", time24: "13:14", time12: "1:14 PM" },
        }}
      />,
    );
    const liveDot = container.querySelector('[data-sun="live"]');
    expect(liveDot).toBeTruthy();
    expect(liveDot?.getAttribute("class")).toContain("fill-accent");
    expect(container.querySelector('[data-sun="below-horizon"]')).toBeFalsy();
    expect(container.querySelector('[data-sun="static"]')).toBeFalsy();
    expect(screen.getByText(/73/)).toBeTruthy();
    expect(screen.getByText(/255/)).toBeTruthy();
    expect(screen.getByText(/up/i)).toBeTruthy();
  });

  it("hides the live accent dot and shows 'below horizon' when sunPosition is not up", () => {
    const { container } = render(
      <SunArc
        overview={o}
        sunPosition={{
          azimuth: 255,
          altitude: -10,
          isUp: false,
          time: { iso: "2026-07-30T20:14:00.000Z", time24: "20:14", time12: "8:14 PM" },
        }}
      />,
    );
    expect(container.querySelector('[data-sun="live"]')).toBeFalsy();
    expect(screen.getByText(/below horizon/i)).toBeTruthy();
  });

  it("falls back to the static dot and renders with no sunPosition prop (backward compat)", () => {
    const { container } = render(<SunArc overview={o} />);
    expect(container.querySelector('[data-sun="static"]')).toBeTruthy();
    expect(container.querySelector('[data-sun="live"]')).toBeFalsy();
    if (o.sunrise) expect(screen.getByText(o.sunrise.time24)).toBeTruthy();
  });
});
