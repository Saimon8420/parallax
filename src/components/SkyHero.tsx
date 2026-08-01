import type { ReactNode } from "react";
import type { SkyOverview, SunPosition } from "../lib/types";
import { skyGradient, skyTier, describeSky, segmentText, type Segment } from "../lib/sky";
import { SkyCompass } from "./SkyCompass";

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

      {/* content over the sky */}
      <div className="relative z-10 mx-auto flex min-h-[440px] max-w-6xl flex-col px-5 pb-14 pt-6 sm:px-8">
        {header}
        <div className="grid flex-1 items-center gap-10 py-6 lg:grid-cols-[1.35fr,1fr]">
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
          <div className="w-full justify-self-center lg:justify-self-end">
            <SkyCompass overview={overview} sunPosition={sunPosition} now={now} />
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
