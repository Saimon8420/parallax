import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { useLang } from "../i18n/useLang";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

function Tag() {
  const { t } = useLang();
  return <p>{t.brand.tagline}</p>;
}

describe("LanguageSwitcher", () => {
  it("switches the whole tree from English to Bengali", () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
        <Tag />
      </LanguageProvider>,
    );
    expect(screen.getByText("your sky, right now")).toBeTruthy();
    fireEvent.click(screen.getByText("বাংলা"));
    expect(screen.getByText("আপনার আকাশ, এই মুহূর্তে")).toBeTruthy();
  });
});
