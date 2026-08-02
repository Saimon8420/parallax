import type { MoonInfo, SkyTime } from "../lib/types";
import { useLang } from "../i18n/useLang";

export function MoonGlyph({ fraction, phaseName, rise = null, set = null, alwaysUp = false, alwaysDown = false, position }: {
  fraction: number; phaseName: string;
  rise?: SkyTime | null; set?: SkyTime | null; alwaysUp?: boolean; alwaysDown?: boolean;
  position?: MoonInfo["position"];
}) {
  const { t, n } = useLang();
  // Simple terminator: overlay a shifted disk to reveal `fraction` of the lit face.
  // offset=0 (new moon) keeps the dark disk centered over the light one; offset=36
  // (full moon, 2x radius) slides it fully clear of the 40px disk.
  const offset = fraction * 36;
  const phase = t.moonPhases[phaseName] ?? phaseName;
  const timesLine = alwaysUp ? t.moonGlyph.upAllDay
    : alwaysDown ? t.moonGlyph.downAllDay
    : `${t.moonGlyph.rise} ${n(rise?.time24 ?? "—")} · ${t.moonGlyph.set} ${n(set?.time24 ?? "—")}`;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10">
        <circle cx="20" cy="20" r="18" className="fill-ink" />
        <circle cx={20 + offset} cy="20" r="18" className="fill-ground" />
        <circle cx="20" cy="20" r="18" className="fill-none stroke-rule" strokeWidth="1" />
      </svg>
      <div className="font-mono text-sm">
        <div className="text-ink">{phase}</div>
        <div className="text-muted">{n(Math.round(fraction * 100))}% {t.moonGlyph.lit}</div>
        <div className="text-muted">{timesLine}</div>
        {position && <div className="text-muted">{`${t.moonGlyph.az} ${n(position.azimuth.toFixed(0))}° · ${t.moonGlyph.alt} ${n(position.altitude.toFixed(0))}° · ${n(Math.round(position.distanceKm).toLocaleString())} ${t.cards.km}`}</div>}
      </div>
    </div>
  );
}
