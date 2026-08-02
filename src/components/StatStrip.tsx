import type { SkyOverview } from "../lib/types";
import { humanUntil } from "../lib/sky";
import { useLang } from "../i18n/useLang";
import { inTime, localizeDayLength } from "../i18n/format";

function Cell({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="bg-card px-4 py-4 sm:px-5">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{k}</div>
      <div className="font-display text-xl font-bold text-ink sm:text-[21px]">
        {v}{sub && <span className="ml-1 text-[12px] font-medium text-muted">{sub}</span>}
      </div>
    </div>
  );
}

export function StatStrip({ overview, now }: { overview: SkyOverview; now: Date }) {
  const { t, n, lang } = useLang();
  const untilSunset = humanUntil(overview.sunset?.iso, now, lang);
  const moon = overview.moon;
  const phase = t.moonPhases[moon.phaseName] ?? moon.phaseName;
  return (
    <div className="relative z-20 -mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-rule shadow-[0_10px_40px_rgba(0,0,0,0.45)] sm:grid-cols-3 lg:grid-cols-5">
      <Cell k={t.stat.sunset} v={n(overview.sunset?.time24 ?? "—")} sub={untilSunset ? inTime(untilSunset, lang) : undefined} />
      <Cell k={t.stat.goldenHour} v={n(overview.goldenEvening.start?.time24 ?? "—")} />
      <Cell k={t.stat.dayLength} v={overview.dayLength ? localizeDayLength(overview.dayLength.formatted, lang) : "—"} />
      <Cell k={t.stat.moonrise} v={moon.rise ? n(moon.rise.time24) : (moon.alwaysUp ? t.stat.up : "—")} />
      <Cell k={t.stat.moon} v={`${n(Math.round(moon.illuminationFraction * 100))}%`} sub={phase.toLowerCase()} />
    </div>
  );
}
