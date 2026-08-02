import type { BodyKey, Positions, SkyOverview, SunPosition } from "../lib/types";
import { compassAbbr } from "../lib/sky";
import { useLang } from "../i18n/useLang";

const DOT: Partial<Record<BodyKey, string>> = {
  sun: "#ffd8a8", moon: "#dfe4ee", venus: "#f2e6c2", jupiter: "#e8d9b0",
  saturn: "#d9c48a", mars: "#ff7a45",
};

function Row({ color, name, value }: { color: string; name: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] py-2 text-[13.5px] last:border-0">
      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex-1 text-ink">{name}</span>
      <span className="font-mono text-[12px] text-muted">{value}</span>
    </div>
  );
}

const PLANETS: BodyKey[] = ["venus", "jupiter", "saturn", "mars"];

export function SkyLegend({ positions, sunPosition, overview }: {
  positions: Positions | null;
  sunPosition: SunPosition | null | undefined;
  overview: SkyOverview;
}) {
  const { t, n, lang } = useLang();
  const moon = overview.moon;
  const moonPct = Math.round(moon.illuminationFraction * 100);

  const planetRows = (positions?.geo ?? [])
    .filter((b) => PLANETS.includes(b.key))
    .sort((a, b) => PLANETS.indexOf(a.key) - PLANETS.indexOf(b.key))
    .map((b) => {
      const status =
        b.aboveHorizon === true ? t.legend.up : b.aboveHorizon === false ? t.legend.below : b.constellation || "—";
      return <Row key={b.key} color={DOT[b.key] ?? "#cfd6e2"} name={t.bodies[b.key]} value={status} />;
    });

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t.legend.title}</h3>
      <Row
        color={DOT.sun!}
        name={t.bodies.sun}
        value={sunPosition ? (sunPosition.isUp
          ? `${n(Math.round(sunPosition.altitude))}° ${t.legend.up} · ${compassAbbr(sunPosition.azimuth, lang)}`
          : t.legend.below) : "—"}
      />
      <Row
        color={DOT.moon!}
        name={t.bodies.moon}
        value={moon.position.altitude > 0 ? `${t.legend.up} · ${n(moonPct)}%` : `${t.legend.below} · ${n(moonPct)}%`}
      />
      {planetRows}
      <p className="mt-4 rounded-lg border border-dashed border-white/12 p-3.5 text-[12px] leading-relaxed text-muted">
        <b className="text-ink">{t.legend.brand}</b> {t.legend.def}{" "}
        <b className="text-ink">{t.legend.fromEarth}</b> {t.legend.rest}
      </p>
    </div>
  );
}
