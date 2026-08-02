import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BodyDetail } from "../components/BodyDetail";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { GeoBody } from "../lib/types";

const mars: GeoBody = {
  key: "mars", eclipticLongitude: 214.2, distanceAu: 1.52, constellation: "Libra",
  magnitude: 0.9, illuminatedFraction: 0.88, phase: "Waxing Gibbous",
  altitude: 22.1, azimuth: 118.3, aboveHorizon: true,
};

describe("BodyDetail", () => {
  it("renders the selected body's real fields", () => {
    render(<BodyDetail body={mars} onClose={() => {}} />);
    expect(screen.getByText(/mars/i)).toBeTruthy();
    expect(screen.getByText(/libra/i)).toBeTruthy();
    expect(screen.getByText(/214\.2/)).toBeTruthy();
  });
  it("renders nothing when body is null", () => {
    const { container } = render(<BodyDetail body={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("labels rows in Bengali under a bn provider", () => {
    const body = { key: "mars", eclipticLongitude: 120.4, distanceAu: 1.5, constellation: "Aries", magnitude: 1.2, illuminatedFraction: 0.9, phase: "gibbous", altitude: 30, azimuth: 200, aboveHorizon: true } as const;
    render(<LanguageProvider initialLang="bn"><BodyDetail body={body} onClose={() => {}} /></LanguageProvider>);
    expect(screen.getByText("দূরত্ব")).toBeTruthy();
    expect(screen.getByText("মঙ্গল")).toBeTruthy(); // Mars
  });
});
