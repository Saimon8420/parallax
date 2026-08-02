import type { CalendarDay, CalendarMonth } from "../lib/types";
import { useLang } from "../i18n/useLang";
import { localizeDayLength } from "../i18n/format";

function leadingBlankCount(firstDate: string): number {
  return new Date(`${firstDate}T00:00:00Z`).getUTCDay();
}
function weekdayOf(date: string, weekdays: string[]): string {
  return weekdays[new Date(`${date}T00:00:00Z`).getUTCDay()]!;
}
function dayOfMonth(date: string): number {
  return Number(date.slice(8, 10));
}
function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h! * 60 + m!;
}

// Tiny lit-fraction disk, same terminator trick as MoonGlyph but scaled down.
function MiniMoon({ fraction, className = "h-2.5 w-2.5" }: { fraction: number; className?: string }) {
  const offset = fraction * 9;
  return (
    <svg viewBox="0 0 10 10" className={`${className} shrink-0`}>
      <circle cx="5" cy="5" r="4.5" className="fill-ink" />
      <circle cx={5 + offset} cy="5" r="4.5" className="fill-ground" />
      <circle cx="5" cy="5" r="4.5" className="fill-none stroke-rule" strokeWidth="0.5" />
    </svg>
  );
}

// Desktop: a compact month-grid cell.
function DayCell({ day }: { day: CalendarDay }) {
  const { n } = useLang();
  return (
    <div className="flex min-h-[44px] flex-col gap-1 rounded-md border border-rule bg-card/40 p-1.5 text-left" data-day-number={dayOfMonth(day.date)}>
      <div className="flex items-center justify-between gap-1">
        <span className="font-mono text-xs text-ink">{n(dayOfMonth(day.date))}</span>
        <MiniMoon fraction={day.moonIllumination} />
      </div>
      <div className="font-mono text-[10px] leading-tight text-muted">
        <div>↑{n(day.sunrise?.time24 ?? "—")}</div>
        <div>↓{n(day.sunset?.time24 ?? "—")}</div>
      </div>
    </div>
  );
}

// Mobile: a full-width day row with a daylight ribbon (sunrise→sunset within the 24h).
function DayRow({ day }: { day: CalendarDay }) {
  const { t, n, lang } = useLang();
  const sr = day.sunrise?.time24, ss = day.sunset?.time24;
  const hasBar = Boolean(sr && ss);
  const left = hasBar ? (toMinutes(sr!) / 1440) * 100 : 0;
  const rightInset = hasBar ? ((1440 - toMinutes(ss!)) / 1440) * 100 : 100;
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.05] py-2.5 last:border-0">
      <div className="w-7 shrink-0 text-center">
        <div className="text-[15px] font-bold leading-none text-ink">{n(dayOfMonth(day.date))}</div>
        <div className="mt-1 font-mono text-[8.5px] uppercase tracking-wide text-faint">{weekdayOf(day.date, t.weekdays)}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between font-mono text-[11px] text-muted">
          <span>↑{n(sr ?? "—")}</span>
          <span className="text-faint">{day.dayLength ? localizeDayLength(day.dayLength, lang) : ""}</span>
          <span>↓{n(ss ?? "—")}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#141a28]">
          {hasBar && (
            <div className="absolute inset-y-0 rounded-full"
              style={{ left: `${left}%`, right: `${rightInset}%`, background: "linear-gradient(90deg,#ffb057,#ff7a45)" }} />
          )}
        </div>
      </div>
      <MiniMoon fraction={day.moonIllumination} className="h-[18px] w-[18px]" />
    </div>
  );
}

export function SkyCalendar({ month }: { month: CalendarMonth }) {
  const { t, n } = useLang();
  const monthLabel = `${t.months[month.month - 1]} ${n(month.year)}`;
  const blanks = month.days.length > 0 ? leadingBlankCount(month.days[0]!.date) : 0;

  return (
    <details className="group overflow-hidden rounded-2xl border border-rule bg-card/40 backdrop-blur-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.03]">
        <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="inline-block text-accent transition-transform duration-200 group-open:rotate-90">▸</span>
          {monthLabel} · {t.calendar.monthly}
        </span>
        <span className="flex items-center gap-3 font-mono text-[10.5px] text-faint">
          <span className="hidden md:inline">{t.calendar.legendHint}</span>
          <span className="rounded-full border border-rule px-2.5 py-1 text-muted transition group-open:hidden">{t.calendar.show}</span>
          <span className="hidden rounded-full border border-accent/50 px-2.5 py-1 text-accent transition group-open:inline">{t.calendar.hide}</span>
        </span>
      </summary>

      <div className="border-t border-rule px-4 pb-4 pt-2 sm:pt-4">
        {/* Mobile: full-width day list with daylight ribbons */}
        <div className="flex flex-col sm:hidden">
          {month.days.map((day) => <DayRow key={day.date} day={day} />)}
        </div>

        {/* Desktop: the month grid */}
        <div className="hidden grid-cols-7 gap-1 sm:grid">
          {t.weekdays.map((label, i) => (
            <div key={i} className="pb-1 font-mono text-[10px] text-faint">{label}</div>
          ))}
          {Array.from({ length: blanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {month.days.map((day) => <DayCell key={day.date} day={day} />)}
        </div>
      </div>
    </details>
  );
}
