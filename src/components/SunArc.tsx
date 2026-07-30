import type { SkyOverview, SunPosition } from "../lib/types";
import { skyPosition } from "../lib/projection";

export function SunArc({ overview, sunPosition }: { overview: SkyOverview; sunPosition?: SunPosition }) {
  if (!overview.sunrise || !overview.sunset) {
    return <p className="font-mono text-sm text-muted">No sunrise today (polar day/night).</p>;
  }
  const live = sunPosition ? skyPosition(sunPosition.altitude, sunPosition.azimuth) : null;
  // Solar noon sits at the apex of the arc's time span; approximate its x by the
  // fraction of the day elapsed at solar noon between sunrise and sunset.
  const noonX = (() => {
    if (!overview.solarNoon) return null;
    const rise = new Date(overview.sunrise!.iso).getTime();
    const set = new Date(overview.sunset!.iso).getTime();
    const noon = new Date(overview.solarNoon.iso).getTime();
    if (set <= rise) return null;
    const t = Math.max(0, Math.min(1, (noon - rise) / (set - rise)));
    return 10 + t * 180;
  })();
  return (
    <div className="font-mono">
      <svg viewBox="0 0 200 70" className="w-full max-w-[280px]">
        <path d="M10 60 A 90 90 0 0 1 190 60" className="fill-none stroke-orbit" strokeWidth="1" />
        <line x1="10" y1="60" x2="190" y2="60" className="stroke-rule" strokeWidth="1" />
        {noonX !== null && (
          <line x1={noonX} y1="8" x2={noonX} y2="14" className="stroke-muted" strokeWidth="1" />
        )}
        {live && live.visible ? (
          <circle cx={live.x} cy={live.y} r="4" className="fill-accent" data-sun="live" />
        ) : live && !live.visible ? (
          <circle cx="100" cy="60" r="3" className="fill-muted" opacity="0.5" data-sun="below-horizon" />
        ) : (
          <circle cx="100" cy="15" r="4" className="fill-ink" data-sun="static" />
        )}
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
      {sunPosition && (
        <p className="mt-1 text-xs font-mono text-muted">
          alt {sunPosition.altitude.toFixed(0)}° · az {sunPosition.azimuth.toFixed(0)}° ·{" "}
          {sunPosition.isUp ? "up" : "below horizon"}
        </p>
      )}
    </div>
  );
}
