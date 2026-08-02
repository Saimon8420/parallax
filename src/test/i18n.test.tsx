import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { localizeDigits } from "../i18n/localizeDigits";
import { DICT } from "../i18n/dict";
import { inTime, localizeDayLength } from "../i18n/format";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { useLang } from "../i18n/useLang";

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

describe("dictionaries", () => {
  it("has 16 compass points, 7 weekdays, 12 months in both languages", () => {
    for (const lang of ["en", "bn"] as const) {
      expect(DICT[lang].compass).toHaveLength(16);
      expect(DICT[lang].compassAbbr).toHaveLength(16);
      expect(DICT[lang].weekdays).toHaveLength(7);
      expect(DICT[lang].months).toHaveLength(12);
    }
  });
  it("translates representative keys to Bengali", () => {
    expect(DICT.bn.compass[0]).toBe("উত্তর");
    expect(DICT.bn.bodies.sun).toBe("সূর্য");
    expect(DICT.bn.moonPhases["Full Moon"]).toBe("পূর্ণিমা");
  });
});

describe("format helpers", () => {
  it("inTime", () => {
    expect(inTime("44m", "en")).toBe("in 44m");
    expect(inTime("৪৪ মিনিট", "bn")).toBe("৪৪ মিনিট পর");
  });
  it("localizeDayLength", () => {
    expect(localizeDayLength("13h 13m", "en")).toBe("13h 13m");
    expect(localizeDayLength("13h 13m", "bn")).toBe("১৩ ঘ ১৩ মি");
  });
});

function Probe() {
  const { lang, setLang, t, n } = useLang();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="tag">{t.brand.tagline}</span>
      <span data-testid="num">{n("2026")}</span>
      <button onClick={() => setLang("bn")}>go-bn</button>
    </div>
  );
}

describe("LanguageProvider", () => {
  it("defaults to English", () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("num").textContent).toBe("2026");
  });
  it("switches to Bengali and localizes numbers", () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    fireEvent.click(screen.getByText("go-bn"));
    expect(screen.getByTestId("lang").textContent).toBe("bn");
    expect(screen.getByTestId("tag").textContent).toBe("আপনার আকাশ, এই মুহূর্তে");
    expect(screen.getByTestId("num").textContent).toBe("২০২৬");
  });
  it("honours initialLang for tests", () => {
    render(<LanguageProvider initialLang="bn"><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang").textContent).toBe("bn");
  });
});
