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
    <div className="flex flex-col gap-1 border border-rule p-1.5 text-left" data-day-number={dayOfMonth(day.date)}>
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
    <details className="border border-rule p-3">
      <summary className="cursor-pointer font-mono text-sm text-muted">Monthly calendar</summary>
      <div className="mt-3">
        <div className="mb-2 font-mono text-sm text-ink">{monthLabel}</div>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="font-mono text-[10px] text-muted">{label}</div>
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
