import { useState } from "react";
import type { BodyKey, Location } from "./lib/types";
import type { Frame } from "./lib/projection";
import { DEFAULT_LOCATION, loadLocation, saveLocation } from "./lib/geo";
import { useSky } from "./lib/useSky";
import { Dial } from "./components/Dial";
import { FrameToggle } from "./components/FrameToggle";
import { MySky } from "./components/MySky";
import { LocationBar } from "./components/LocationBar";
import { BodyDetail } from "./components/BodyDetail";
import { Clock } from "./components/Clock";
import { MoonPhases } from "./components/MoonPhases";
import { SkyCalendar } from "./components/SkyCalendar";

export default function App() {
  const [loc, setLoc] = useState<Location>(() => loadLocation() ?? DEFAULT_LOCATION);
  const [frame, setFrame] = useState<Frame>("earth");
  const [selected, setSelected] = useState<BodyKey | null>(null);
  const {
    positions, overview, posError, skyError, loading,
    sunPosition, sunPositionError,
    moonPhases, moonPhasesError,
    calendar, calendarError,
  } = useSky(loc);

  const pick = (l: Location) => { setLoc(l); saveLocation(l); };
  const selectedBody = positions?.geo.find((b) => b.key === selected) ?? null;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Parallax</h1>
          <p className="font-mono text-sm text-muted">the sky, right now</p>
        </div>
        <LocationBar current={loc} onPick={pick} />
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        <section className="flex flex-col items-center gap-4">
          <FrameToggle value={frame} onChange={setFrame} />
          {loading && <p className="font-mono text-muted">computing…</p>}
          {posError && <p className="font-mono text-accent">{posError} · retrying…</p>}
          {positions && <Dial frame={frame} positions={positions} onSelect={setSelected} />}
          {positions && frame === "helio" && positions.helio.length === 0 && (
            <p className="font-mono text-sm text-muted">Heliocentric data unavailable</p>
          )}
          {positions && <Clock datetime={positions.datetime} />}
        </section>

        <div className="flex flex-col gap-6">
          {skyError && <p className="font-mono text-accent">{skyError}</p>}
          {overview && <MySky overview={overview} sunPosition={sunPosition} />}
          {sunPositionError && !sunPosition && (
            <p className="font-mono text-xs text-muted">live sun position unavailable</p>
          )}
          <BodyDetail body={selectedBody} onClose={() => setSelected(null)} />

          <section className="flex flex-col gap-2 border border-rule p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Upcoming moon phases</h2>
            {moonPhases && moonPhases.length > 0 && <MoonPhases phases={moonPhases} now={new Date()} />}
            {moonPhasesError && !moonPhases && (
              <p className="font-mono text-xs text-muted">moon phases unavailable</p>
            )}
          </section>

          {calendar && <SkyCalendar month={calendar} />}
          {calendarError && !calendar && (
            <p className="font-mono text-xs text-muted">calendar unavailable</p>
          )}
        </div>
      </div>
    </main>
  );
}
