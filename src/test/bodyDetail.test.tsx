import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BodyDetail } from "../components/BodyDetail";
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
});
