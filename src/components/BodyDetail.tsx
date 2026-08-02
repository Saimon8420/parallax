import type { GeoBody } from "../lib/types";
import { useLang } from "../i18n/useLang";

export function BodyDetail({ body, onClose }: { body: GeoBody | null; onClose: () => void }) {
  const { t, n } = useLang();
  if (!body) return null;
  const rows: [string, string][] = [
    [t.bodyDetail.eclipticLongitude, `${n(body.eclipticLongitude.toFixed(1))}°`],
    [t.bodyDetail.distance, `${n(body.distanceAu.toFixed(4))} AU`],
    [t.bodyDetail.constellation, body.constellation],
    [t.bodyDetail.magnitude, body.magnitude === null ? "—" : n(body.magnitude.toFixed(2))],
    [t.bodyDetail.phase, body.phase || "—"],
    ...(body.altitude !== undefined
      ? ([[t.bodyDetail.altitude, `${n(body.altitude.toFixed(1))}°`], [t.bodyDetail.azimuth, `${n(body.azimuth!.toFixed(1))}°`]] as [string, string][])
      : []),
  ];
  return (
    <aside className="rounded-2xl border border-rule bg-card/60 p-5 font-mono backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg uppercase text-ink">{t.bodies[body.key]}</h3>
        <button onClick={onClose} className="text-muted hover:text-accent">{t.bodyDetail.close}</button>
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
