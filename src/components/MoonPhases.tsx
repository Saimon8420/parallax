import type { MoonPhaseEvent } from "../lib/types";
import { useLang } from "../i18n/useLang";

const DAY_MS = 86400000;

const GLYPH: Record<string, string> = {
  "New Moon": "🌑", "First Quarter": "🌓", "Full Moon": "🌕", "Last Quarter": "🌗",
};

// YYYY-MM-DD in UTC, matching how MoonPhaseEvent.dateLabel is produced by the API.
function utcDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysUntilLabel(event: MoonPhaseEvent, now: Date, t: ReturnType<typeof useLang>["t"], n: (v: string | number) => string) {
  if (event.dateLabel === utcDate(now)) return t.moonPhasesLabels.today;
  const daysUntil = Math.max(1, Math.round((Date.parse(event.utcISO) - now.getTime()) / DAY_MS));
  return daysUntil === 1 ? t.moonPhasesLabels.inOneDay : t.moonPhasesLabels.inDays.replace("{n}", n(daysUntil));
}

export function MoonPhases({ phases, now }: { phases: MoonPhaseEvent[]; now: Date }) {
  const { t, n } = useLang();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {phases.map((p) => {
        const label = daysUntilLabel(p, now, t, n);
        const isToday = label === t.moonPhasesLabels.today;
        return (
          <div key={`${p.phase}-${p.utcISO}`}
            className={`rounded-xl border p-4 ${isToday ? "border-accent/60 bg-accent/[0.06]" : "border-rule bg-card/50"}`}>
            <div className="text-2xl leading-none">{GLYPH[p.phase] ?? "🌙"}</div>
            <div className={`mt-2 text-sm font-bold ${isToday ? "text-accent" : "text-ink"}`}>{t.moonPhases[p.phase] ?? p.phase}</div>
            <div className="mt-1 font-mono text-[11.5px] text-muted">{n(p.dateLabel)}</div>
            <div className={`font-mono text-[11.5px] ${isToday ? "text-accent" : "text-muted"}`}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}
