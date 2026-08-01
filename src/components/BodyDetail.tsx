import type { GeoBody } from "../lib/types";
import { BODY_META } from "../lib/bodies";

export function BodyDetail({ body, onClose }: { body: GeoBody | null; onClose: () => void }) {
  if (!body) return null;
  const rows: [string, string][] = [
    ["ecliptic longitude", `${body.eclipticLongitude.toFixed(1)}°`],
    ["distance", `${body.distanceAu.toFixed(4)} AU`],
    ["constellation", body.constellation],
    ["magnitude", body.magnitude === null ? "—" : body.magnitude.toFixed(2)],
    ["phase", body.phase || "—"],
    ...(body.altitude !== undefined
      ? ([["altitude", `${body.altitude.toFixed(1)}°`], ["azimuth", `${body.azimuth!.toFixed(1)}°`]] as [string, string][])
      : []),
  ];
  return (
    <aside className="rounded-2xl border border-rule bg-card/60 p-5 font-mono backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg uppercase text-ink">{BODY_META[body.key].label}</h3>
        <button onClick={onClose} className="text-muted hover:text-accent">close ✕</button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt><dd className="text-ink text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
