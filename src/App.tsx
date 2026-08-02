import { useState } from "react";
import type { BodyKey, Location } from "./lib/types";
import type { Frame } from "./lib/projection";
import { DEFAULT_LOCATION, loadLocation, saveLocation } from "./lib/geo";
import { useSky } from "./lib/useSky";
import { useLang } from "./i18n/useLang";
import { Dial } from "./components/Dial";
import { FrameToggle } from "./components/FrameToggle";
import { SkyHero } from "./components/SkyHero";
import { StatStrip } from "./components/StatStrip";
import { SkyLegend } from "./components/SkyLegend";
import { SunCard, TwilightCard, MoonCard } from "./components/DetailCards";
import { LocationBar } from "./components/LocationBar";
import { BodyDetail } from "./components/BodyDetail";
import { Clock } from "./components/Clock";
import { MoonPhases } from "./components/MoonPhases";
import { SkyCalendar } from "./components/SkyCalendar";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function Brand() {
  const { t } = useLang();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-ink">Parallax</h1>
      <p className="font-mono text-[11px] text-white/70">{t.brand.tagline}</p>
    </div>
  );
}

function SectionHead({ title, aside }: { title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-mono text-[12.5px] uppercase tracking-[0.2em] text-muted">{title}</h2>
      {aside}
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  const [loc, setLoc] = useState<Location>(() => loadLocation() ?? DEFAULT_LOCATION);
  const [frame, setFrame] = useState<Frame>("earth");
  const [selected, setSelected] = useState<BodyKey | null>(null);
  const now = new Date();
  const {
    positions, overview, posError, skyError, loading,
    sunPosition, sunPositionError,
    moonPhases, moonPhasesError,
    calendar, calendarError,
  } = useSky(loc);

  const pick = (l: Location) => { setLoc(l); saveLocation(l); };
  const selectedBody = positions?.geo.find((b) => b.key === selected) ?? null;
  const header = (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <Brand />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <LanguageSwitcher />
        <LocationBar current={loc} onPick={pick} />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      {/* 1 · the sky hero (full-bleed) */}
      {overview ? (
        <SkyHero overview={overview} sunPosition={sunPosition} header={header} now={now} />
      ) : (
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#0a1230,#16244f 60%,#2d3d6b)" }}>
          <div className="mx-auto flex min-h-[300px] max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
            {header}
            <p className="mt-auto pt-14 font-mono text-muted">
              {skyError ? `${skyError} · ${t.status.retrying}` : loading ? t.status.readingSky : ""}
            </p>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        {/* 2 · key-stat strip on the horizon */}
        {overview && <StatStrip overview={overview} now={now} />}

        {/* 3 · zoom out — the whole sky, two views */}
        <section className="mt-16">
          <SectionHead
            title={t.sections.zoomOut}
            aside={<FrameToggle value={frame} onChange={setFrame} showCaption={false} />}
          />
          <div className="grid gap-5 lg:grid-cols-[1.35fr,1fr]">
            <div className="flex flex-col items-center rounded-2xl border border-rule bg-card/40 p-5 backdrop-blur-sm">
              {posError && <p className="mb-2 font-mono text-sm text-accent">{posError} · {t.status.retrying}</p>}
              {positions && <Dial frame={frame} positions={positions} onSelect={setSelected} />}
              {!positions && <p className="py-16 font-mono text-muted">{t.dial.plotting}</p>}
              {positions && frame === "helio" && positions.helio.length === 0 && (
                <p className="mt-2 font-mono text-sm text-muted">{t.dial.helioUnavailable}</p>
              )}
              <p className="mt-3 max-w-md text-center font-mono text-[11px] text-faint">
                {t.dial.centreHint}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {overview && <SkyLegend positions={positions} sunPosition={sunPosition} overview={overview} />}
            </div>
          </div>
          {selectedBody && (
            <div className="mt-4">
              <BodyDetail body={selectedBody} onClose={() => setSelected(null)} />
            </div>
          )}
        </section>

        {/* 4 · today in detail */}
        {overview && (
          <section className="mt-16">
            <SectionHead title={t.sections.todayDetail} />
            <div className="grid gap-4 md:grid-cols-3">
              <SunCard overview={overview} />
              <TwilightCard overview={overview} />
              <MoonCard overview={overview} />
            </div>
          </section>
        )}

        {/* 5 · upcoming moon phases */}
        {moonPhases && moonPhases.length > 0 && (
          <section className="mt-16">
            <SectionHead title={t.sections.moonPhases} />
            <MoonPhases phases={moonPhases} now={now} />
          </section>
        )}
        {moonPhasesError && !moonPhases && (
          <p className="mt-8 font-mono text-xs text-muted">{t.errors.moonPhases}</p>
        )}

        {/* 6 · monthly calendar */}
        {calendar && (
          <section className="mt-8">
            <SkyCalendar month={calendar} />
          </section>
        )}
        {calendarError && !calendar && (
          <p className="mt-4 font-mono text-xs text-muted">{t.errors.calendar}</p>
        )}

        {sunPositionError && !sunPosition && (
          <p className="mt-8 font-mono text-xs text-muted">{t.errors.sunPosition}</p>
        )}

        <footer className="mt-16 border-t border-rule pt-5">
          {positions ? <Clock datetime={positions.datetime} />
            : <p className="font-mono text-xs text-faint">{t.footer.dataNote}</p>}
        </footer>
      </div>
    </main>
  );
}
