import type { MoonPhaseEvent } from "../lib/types";

const DAY_MS = 86400000;

// YYYY-MM-DD in UTC, matching how MoonPhaseEvent.dateLabel is produced by the API.
function utcDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysUntilLabel(event: MoonPhaseEvent, now: Date) {
  if (event.dateLabel === utcDate(now)) return "today";
  const daysUntil = Math.max(1, Math.round((Date.parse(event.utcISO) - now.getTime()) / DAY_MS));
  return daysUntil === 1 ? "in 1 day" : `in ${daysUntil} days`;
}

export function MoonPhases({ phases, now }: { phases: MoonPhaseEvent[]; now: Date }) {
  return (
    <div className="font-mono text-sm">
      {phases.map((p) => {
        const label = daysUntilLabel(p, now);
        const isToday = label === "today";
        return (
          <div key={`${p.phase}-${p.utcISO}`} className="flex items-center justify-between gap-3 py-1">
            <span className={isToday ? "text-accent" : "text-ink"}>{p.phase}</span>
            <span className="text-muted">{p.dateLabel}</span>
            <span className={isToday ? "text-accent" : "text-muted"}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
