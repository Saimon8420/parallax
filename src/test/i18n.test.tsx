import { describe, it, expect } from "vitest";
import { localizeDigits } from "../i18n/localizeDigits";

describe("localizeDigits", () => {
  it("maps ASCII digits to Bengali numerals in bn", () => {
    expect(localizeDigits("05:14", "bn")).toBe("০৫:১৪");
    expect(localizeDigits("9°", "bn")).toBe("৯°");
    expect(localizeDigits("34%", "bn")).toBe("৩৪%");
    expect(localizeDigits(2026, "bn")).toBe("২০২৬");
  });
  it("leaves non-digits and English untouched", () => {
    expect(localizeDigits("05:14", "en")).toBe("05:14");
    expect(localizeDigits("in 44m", "bn")).toBe("in ৪৪m"); // only digits change
  });
});
