import type { MoonPhaseEvent } from "../lib/types";

const DAY_MS = 86400000;

function daysUntilLabel(utcISO: string, now: Date) {
  const daysUntil = Math.round((Date.parse(utcISO) - now.getTime()) / DAY_MS);
  if (daysUntil === 0) return "today";
  if (daysUntil === 1) return "in 1 day";
  return `in ${daysUntil} days`;
}

export function MoonPhases({ phases, now }: { phases: MoonPhaseEvent[]; now: Date }) {
  return (
    <div className="font-mono text-sm">
      {phases.map((p) => {
        const label = daysUntilLabel(p.utcISO, now);
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
