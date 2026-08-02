import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkyCalendar } from "../components/SkyCalendar";
import calendarFixture from "./fixtures/calendar.json";
import { normalizeCalendar } from "../lib/horizonClient";
import { LanguageProvider } from "../i18n/LanguageProvider";

const month = normalizeCalendar(calendarFixture);

describe("SkyCalendar", () => {
  it("renders one day-number cell per day in the month", () => {
    const { container } = render(<SkyCalendar month={month} />);
    const dayCells = container.querySelectorAll("[data-day-number]");
    expect(dayCells.length).toBe(month.days.length);
    expect(month.days.length).toBe(31);
  });

  it("shows the month + year header", () => {
    render(<SkyCalendar month={month} />);
    expect(screen.getByText(/July 2026/)).toBeTruthy();
  });

  it("shows a known day's sunrise time (in both the mobile list and the desktop grid)", () => {
    render(<SkyCalendar month={month} />);
    expect(screen.getAllByText(/05:14/).length).toBeGreaterThan(0);
  });

  it("renders the month header in Bengali under a bn provider", () => {
    render(<LanguageProvider initialLang="bn"><SkyCalendar month={month} /></LanguageProvider>);
    expect(screen.getByText(/জুলাই/)).toBeTruthy(); // July
    expect(screen.getByText(/মাসিক ক্যালেন্ডার/)).toBeTruthy();
  });
});
