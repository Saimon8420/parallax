import type { CalendarDay, CalendarMonth } from "../lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function leadingBlankCount(firstDate: string): number {
  return new Date(`${firstDate}T00:00:00Z`).getUTCDay();
}

function dayOfMonth(date: string): number {
  return Number(date.slice(8, 10));
}

// Tiny lit-fraction disk, same terminator trick as MoonGlyph but scaled down.
function MiniMoon({ fraction }: { fraction: number }) {
  const offset = fraction * 9;
  return (
    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0">
      <circle cx="5" cy="5" r="4.5" className="fill-ink" />
      <circle cx={5 + offset} cy="5" r="4.5" className="fill-ground" />
      <circle cx="5" cy="5" r="4.5" className="fill-none stroke-rule" strokeWidth="0.5" />
    </svg>
  );
}

function DayCell({ day }: { day: CalendarDay }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-rule bg-card/40 p-1.5 text-left" data-day-number={dayOfMonth(day.date)}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink">{dayOfMonth(day.date)}</span>
        <MiniMoon fraction={day.moonIllumination} />
      </div>
      <div className="font-mono text-[10px] leading-tight text-muted">
        <div>↑{day.sunrise?.time24 ?? "—"}</div>
        <div>↓{day.sunset?.time24 ?? "—"}</div>
      </div>
    </div>
  );
}

export function SkyCalendar({ month }: { month: CalendarMonth }) {
  const monthLabel = `${MONTH_NAMES[month.month - 1]} ${month.year}`;
  const blanks = month.days.length > 0 ? leadingBlankCount(month.days[0]!.date) : 0;

  return (
    <details className="group overflow-hidden rounded-2xl border border-rule bg-card/40 backdrop-blur-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.03]">
        <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="inline-block text-accent transition-transform duration-200 group-open:rotate-90">▸</span>
          {monthLabel} · monthly calendar
        </span>
        <span className="flex items-center gap-3 font-mono text-[10.5px] text-faint">
          <span className="hidden md:inline">sunrise ↑ · sunset ↓ · moon</span>
          <span className="rounded-full border border-rule px-2.5 py-1 text-muted transition group-open:hidden">Show</span>
          <span className="hidden rounded-full border border-accent/50 px-2.5 py-1 text-accent transition group-open:inline">Hide</span>
        </span>
      </summary>
      <div className="border-t border-rule px-4 pb-4 pt-4">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="pb-1 font-mono text-[10px] text-faint">{label}</div>
          ))}
          {Array.from({ length: blanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {month.days.map((day) => (
            <DayCell key={day.date} day={day} />
          ))}
        </div>
      </div>
    </details>
  );
}
