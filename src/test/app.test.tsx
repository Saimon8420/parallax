import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { LanguageProvider } from "../i18n/LanguageProvider";
import positions from "./fixtures/positions.json";
import overview from "./fixtures/overview.json";

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows an unobtrusive note in the helio frame when heliocentric data is unavailable (fix #2)", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) {
        return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) } as Response);
      }
      if (url.includes("overview")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(overview) } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(positions) } as Response);
    }));

    render(<App />);

    // Geocentric ("FROM EARTH") view renders regardless of helio being down.
    await waitFor(() => expect(document.querySelector("svg")).toBeTruthy());
    expect(screen.queryByText(/heliocentric data unavailable/i)).toBeNull();

    fireEvent.click(screen.getByText(/from above/i));
    expect(await screen.findByText(/heliocentric data unavailable/i)).toBeTruthy();
  });

  it("renders the section headings in Bengali under a bn provider", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) } as Response);
      if (url.includes("overview")) return Promise.resolve({ ok: true, json: () => Promise.resolve(overview) } as Response);
      return Promise.resolve({ ok: true, json: () => Promise.resolve(positions) } as Response);
    }));
    render(<LanguageProvider initialLang="bn"><App /></LanguageProvider>);
    expect(await screen.findByText(/পিছিয়ে দেখুন/)).toBeTruthy();
  });
});
