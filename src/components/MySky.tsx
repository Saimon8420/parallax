import type { SkyOverview } from "../lib/types";
import { SunArc } from "./SunArc";
import { MoonGlyph } from "./MoonGlyph";

export function MySky({ overview }: { overview: SkyOverview }) {
  return (
    <section className="flex flex-col gap-6 border border-rule p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted">My Sky · today</h2>
      <SunArc overview={overview} />
      <MoonGlyph
        fraction={overview.moon.illuminationFraction}
        phaseName={overview.moon.phaseName}
        rise={overview.moon.rise}
        set={overview.moon.set}
        alwaysUp={overview.moon.alwaysUp}
        alwaysDown={overview.moon.alwaysDown}
        position={overview.moon.position}
      />
    </section>
  );
}
