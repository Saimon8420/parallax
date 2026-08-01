import type { SkyOverview } from "../lib/types";
import { humanUntil } from "../lib/sky";

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
  const untilSunset = humanUntil(overview.sunset?.iso, now);
  const moon = overview.moon;
  return (
    <div className="relative z-20 -mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-rule shadow-[0_10px_40px_rgba(0,0,0,0.45)] sm:grid-cols-3 lg:grid-cols-5">
      <Cell k="Sunset" v={overview.sunset?.time24 ?? "—"} sub={untilSunset ? `in ${untilSunset}` : undefined} />
      <Cell k="Golden hour" v={overview.goldenEvening.start?.time24 ?? "—"} />
      <Cell k="Day length" v={overview.dayLength?.formatted ?? "—"} />
      <Cell k="Moonrise" v={moon.rise?.time24 ?? (moon.alwaysUp ? "up" : "—")} />
      <Cell k="Moon" v={`${Math.round(moon.illuminationFraction * 100)}%`} sub={moon.phaseName.toLowerCase()} />
    </div>
  );
}
