import type { SkyOverview, SkyTime } from "../lib/types";
import { MoonGlyph } from "./MoonGlyph";

const t = (time: SkyTime | null | undefined) => time?.time24 ?? "—";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-rule bg-card/60 p-5 backdrop-blur-sm">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{title}</h3>
      {children}
    </div>
  );
}

function DRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/[0.06] py-[7px] text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-mono font-medium text-ink">{value}</span>
    </div>
  );
}

export function SunCard({ overview }: { overview: SkyOverview }) {
  const golden = overview.goldenEvening;
  return (
    <Card title="☀ Sun">
      <DRow label="Sunrise" value={t(overview.sunrise)} />
      <DRow label="Solar noon" value={t(overview.solarNoon)} />
      <DRow label="Sunset" value={t(overview.sunset)} />
      <DRow label="Golden hour" value={golden.start && golden.end ? `${golden.start.time24}–${golden.end.time24}` : "—"} />
      <DRow label="Day length" value={overview.dayLength?.formatted ?? "—"} />
    </Card>
  );
}

export function TwilightCard({ overview }: { overview: SkyOverview }) {
  const w = overview.twilight;
  return (
    <Card title="◔ Twilight">
      <DRow label="Civil" value={`${t(w.civilDawn)} · ${t(w.civilDusk)}`} />
      <DRow label="Nautical" value={`${t(w.nauticalDawn)} · ${t(w.nauticalDusk)}`} />
      <DRow label="Astronomical" value={`${t(w.astroDawn)} · ${t(w.astroDusk)}`} />
      <DRow label="First light" value={t(w.astroDawn)} />
      <DRow label="Last light" value={t(w.astroDusk)} />
    </Card>
  );
}

export function MoonCard({ overview }: { overview: SkyOverview }) {
  const m = overview.moon;
  return (
    <Card title="☾ Moon">
      <div className="mb-3">
        <MoonGlyph
          fraction={m.illuminationFraction}
          phaseName={m.phaseName}
          rise={m.rise}
          set={m.set}
          alwaysUp={m.alwaysUp}
          alwaysDown={m.alwaysDown}
        />
      </div>
      <DRow label="Distance" value={`${Math.round(m.position.distanceKm).toLocaleString()} km`} />
      <DRow label="Position" value={m.position.altitude > 0 ? `up · alt ${Math.round(m.position.altitude)}°` : `below · az ${Math.round(m.position.azimuth)}°`} />
    </Card>
  );
}
