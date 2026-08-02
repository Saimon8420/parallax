import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dial } from "../components/Dial";
import positions from "./fixtures/positions.json";
import helio from "./fixtures/heliocentric.json";
import { normalizePositions } from "../lib/orreryClient";
import { LanguageProvider } from "../i18n/LanguageProvider";

const p = normalizePositions(positions, helio);

describe("Dial", () => {
  it("renders an svg with a body mark per geocentric body in earth frame", () => {
    const { container } = render(<Dial frame="earth" positions={p} onSelect={() => {}} />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("[data-body]").length).toBe(p.geo.length);
  });
  it("renders a mark per heliocentric body in helio frame, excluding pluto (spec §3b)", () => {
    const { container } = render(<Dial frame="helio" positions={p} onSelect={() => {}} />);
    const expected = p.helio.filter((b) => b.key !== "pluto").length;
    expect(container.querySelectorAll("[data-body]").length).toBe(expected);
    expect(container.querySelector('[data-body="pluto"]')).toBeNull();
  });

  it("renders Bengali labels and numerals under a bn provider", () => {
    render(
      <LanguageProvider initialLang="bn">
        <Dial frame="earth" positions={p} onSelect={() => {}} />
      </LanguageProvider>,
    );
    expect(screen.getByText("আপনি")).toBeTruthy();
    expect(screen.getByText("৯০°")).toBeTruthy();
  });
});
