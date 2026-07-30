import type { SkyOverview } from "../lib/types";

export function SunArc({ overview }: { overview: SkyOverview }) {
  if (!overview.sunrise || !overview.sunset) {
    return <p className="font-mono text-sm text-muted">No sunrise today (polar day/night).</p>;
  }
  return (
    <div className="font-mono">
      <svg viewBox="0 0 200 70" className="w-full max-w-[280px]">
        <path d="M10 60 A 90 90 0 0 1 190 60" className="fill-none stroke-orbit" strokeWidth="1" />
        <line x1="10" y1="60" x2="190" y2="60" className="stroke-rule" strokeWidth="1" />
        <circle cx="100" cy="15" r="4" className="fill-accent" />
      </svg>
      <div className="mt-2 flex justify-between text-sm">
        <span><span className="text-muted">rise </span>{overview.sunrise.time24}</span>
        {overview.solarNoon && <span><span className="text-muted">noon </span>{overview.solarNoon.time24}</span>}
        <span><span className="text-muted">set </span>{overview.sunset.time24}</span>
      </div>
      {overview.goldenEvening.start && overview.goldenEvening.end && (
        <p className="mt-1 text-xs text-muted">
          golden hour {overview.goldenEvening.start.time24}–{overview.goldenEvening.end.time24}
        </p>
      )}
    </div>
  );
}
