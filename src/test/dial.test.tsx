import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Dial } from "../components/Dial";
import positions from "./fixtures/positions.json";
import helio from "./fixtures/heliocentric.json";
import { normalizePositions } from "../lib/orreryClient";

const p = normalizePositions(positions, helio);

describe("Dial", () => {
  it("renders an svg with a body mark per geocentric body in earth frame", () => {
    const { container } = render(<Dial frame="earth" positions={p} onSelect={() => {}} />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("[data-body]").length).toBe(p.geo.length);
  });
  it("renders a mark per heliocentric body in helio frame", () => {
    const { container } = render(<Dial frame="helio" positions={p} onSelect={() => {}} />);
    expect(container.querySelectorAll("[data-body]").length).toBe(p.helio.length);
  });
});
