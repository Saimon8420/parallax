import type { SkyOverview, SkyTime } from "../lib/types";
import { MoonGlyph } from "./MoonGlyph";
import { useLang } from "../i18n/useLang";
import { localizeDayLength } from "../i18n/format";

// at module top, keep a raw formatter but rename to avoid clashing with dict `t`
const fmt = (time: SkyTime | null | undefined) => time?.time24 ?? "—";

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
  const { t, n, lang } = useLang();
  const golden = overview.goldenEvening;
  return (
    <Card title={`☀ ${t.cards.sun}`}>
      <DRow label={t.cards.sunrise} value={n(fmt(overview.sunrise))} />
      <DRow label={t.cards.solarNoon} value={n(fmt(overview.solarNoon))} />
      <DRow label={t.cards.sunset} value={n(fmt(overview.sunset))} />
      <DRow label={t.cards.goldenHour} value={golden.start && golden.end ? `${n(golden.start.time24)}–${n(golden.end.time24)}` : "—"} />
      <DRow label={t.cards.dayLength} value={overview.dayLength ? localizeDayLength(overview.dayLength.formatted, lang) : "—"} />
    </Card>
  );
}

export function TwilightCard({ overview }: { overview: SkyOverview }) {
  const { t, n } = useLang();
  const w = overview.twilight;
  return (
    <Card title={`◔ ${t.cards.twilight}`}>
      <DRow label={t.cards.civil} value={`${n(fmt(w.civilDawn))} · ${n(fmt(w.civilDusk))}`} />
      <DRow label={t.cards.nautical} value={`${n(fmt(w.nauticalDawn))} · ${n(fmt(w.nauticalDusk))}`} />
      <DRow label={t.cards.astronomical} value={`${n(fmt(w.astroDawn))} · ${n(fmt(w.astroDusk))}`} />
      <DRow label={t.cards.firstLight} value={n(fmt(w.astroDawn))} />
      <DRow label={t.cards.lastLight} value={n(fmt(w.astroDusk))} />
    </Card>
  );
}

export function MoonCard({ overview }: { overview: SkyOverview }) {
  const { t, n } = useLang();
  const m = overview.moon;
  return (
    <Card title={`☾ ${t.cards.moon}`}>
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
      <DRow label={t.cards.distance} value={`${n(Math.round(m.position.distanceKm).toLocaleString())} ${t.cards.km}`} />
      <DRow label={t.cards.position} value={m.position.altitude > 0
        ? `${t.cards.upAlt} ${n(Math.round(m.position.altitude))}°`
        : `${t.cards.belowAz} ${n(Math.round(m.position.azimuth))}°`} />
    </Card>
  );
}
