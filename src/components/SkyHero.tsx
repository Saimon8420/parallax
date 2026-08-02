import type { ReactNode } from "react";
import type { SkyOverview, SunPosition } from "../lib/types";
import { skyGradient, skyTier, describeSky, segmentText, type Segment } from "../lib/sky";
import { SkyCompass } from "./SkyCompass";
import { useLang } from "../i18n/useLang";

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
  const { t, n, lang } = useLang();
  const alt = sunPosition?.altitude ?? null;
  const isUp = sunPosition?.isUp ?? false;
  const tier = skyTier(alt, isUp);
  const gradient = skyGradient(alt, isUp);
  const { sun, moon } = describeSky(overview, sunPosition, now, lang);
  const d = now;
  const dateStr = `${t.weekdays[d.getDay()]} ${n(d.getDate())} ${t.months[d.getMonth()]}`;

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: gradient }}
      aria-label={t.hero.ariaLabel}
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
              {t.hero.kicker} · {dateStr}
              {sunPosition?.time.time12 ? ` · ${n(sunPosition.time.time12)}` : ""}
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
        <span>← {t.hero.sunriseE} {n(overview.sunrise?.time24 ?? "—")} · {t.rose.e}</span>
        <span className="hidden sm:inline">{t.hero.horizon}</span>
        <span>{t.rose.w} · {t.hero.sunsetW} {n(overview.sunset?.time24 ?? "—")} →</span>
      </div>
    </section>
  );
}
