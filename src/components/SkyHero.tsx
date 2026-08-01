import type { ReactNode } from "react";
import type { SkyOverview, SunPosition } from "../lib/types";
import { skyGradient, skyTier, skyPlot, describeSky, segmentText, type Segment } from "../lib/sky";

function Lede({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.b ? <b key={i} className="font-semibold text-white">{s.t}</b> : <span key={i}>{s.t}</span>,
      )}
    </>
  );
}

export function SkyHero({ overview, sunPosition, header, now }: {
  overview: SkyOverview;
  sunPosition: SunPosition | null | undefined;
  header: ReactNode;
  now: Date;
}) {
  const alt = sunPosition?.altitude ?? null;
  const isUp = sunPosition?.isUp ?? false;
  const tier = skyTier(alt, isUp);
  const gradient = skyGradient(alt, isUp);
  const { sun, moon } = describeSky(overview, sunPosition, now);

  const sunXY = sunPosition && isUp ? skyPlot(sunPosition.altitude, sunPosition.azimuth) : null;
  const moonPos = overview.moon.position;
  const moonUp = moonPos.altitude > 0;
  const moonXY = skyPlot(Math.max(moonPos.altitude, 0), moonPos.azimuth);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: gradient }}
      aria-label="Your sky right now"
    >
      {/* starfield — brighter at night */}
      <div
        className="starfield pointer-events-none absolute inset-0"
        style={{ opacity: tier === "night" ? 0.8 : tier === "golden" ? 0.45 : 0.15 }}
      />

      {/* sun's day-arc */}
      <svg
        viewBox="0 0 1000 420" preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path d="M 40 380 Q 420 40 900 96" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.4" strokeDasharray="3 8" />
      </svg>

      {/* the Sun at its real position */}
      {sunXY && (
        <div
          className="pointer-events-none absolute z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${sunXY.leftPct}%`, top: `${sunXY.topPct}%` }}
        >
          <div className="h-11 w-11 rounded-full"
            style={{ background: "radial-gradient(circle,#fff2d8,#ffb057 60%,#ff7a45)", boxShadow: "0 0 46px 14px rgba(255,150,80,.5)" }} />
          <div className="mt-1 whitespace-nowrap font-mono text-[11px] text-amber-100/90">
            Sun · {Math.round(sunPosition!.altitude)}°
          </div>
        </div>
      )}

      {/* the Moon (faint under the horizon when it's down) */}
      <div
        className="pointer-events-none absolute z-[1] -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${moonXY.leftPct}%`, top: moonUp ? `${moonXY.topPct}%` : "90%", opacity: moonUp ? 0.85 : 0.35 }}
      >
        <div className="h-7 w-7 rounded-full" style={{ background: "radial-gradient(circle at 60% 40%,#eef2fb,#aab4cc)" }} />
      </div>

      {/* content over the sky */}
      <div className="relative z-10 mx-auto flex min-h-[440px] max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
        {header}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-14">
          <div className="max-w-2xl">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              Your sky · {now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              {sunPosition?.time.time12 ? ` · ${sunPosition.time.time12}` : ""}
            </div>
            <p className="text-2xl font-medium leading-snug text-ink drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-[30px]"
              aria-label={`${segmentText(sun)} ${segmentText(moon)}`}>
              <Lede segments={sun} />{" "}
              <Lede segments={moon} />
            </p>
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-white/75">
            {sunPosition && (<>
              <div>altitude {Math.round(sunPosition.altitude)}°</div>
              <div>azimuth {Math.round(sunPosition.azimuth)}°</div>
            </>)}
            {overview.goldenEvening.start && <div>golden hour → {overview.goldenEvening.start.time24}</div>}
          </div>
        </div>
      </div>

      {/* the literal horizon line + endpoints */}
      <div className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,220,190,.9),transparent)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto flex max-w-6xl justify-between px-5 font-mono text-[10px] text-white/60 sm:px-8">
        <span>← sunrise {overview.sunrise?.time24 ?? "—"} · E</span>
        <span className="hidden sm:inline">the horizon</span>
        <span>W · sunset {overview.sunset?.time24 ?? "—"} →</span>
      </div>
    </section>
  );
}
