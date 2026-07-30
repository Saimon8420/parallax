import type { SkyTime } from "../lib/types";

function moonTimesLine(rise: SkyTime | null, set: SkyTime | null, alwaysUp: boolean, alwaysDown: boolean) {
  if (alwaysUp) return "up all day";
  if (alwaysDown) return "down all day";
  return `rise ${rise?.time24 ?? "—"} · set ${set?.time24 ?? "—"}`;
}

export function MoonGlyph({ fraction, phaseName, rise = null, set = null, alwaysUp = false, alwaysDown = false }: {
  fraction: number; phaseName: string;
  rise?: SkyTime | null; set?: SkyTime | null; alwaysUp?: boolean; alwaysDown?: boolean;
}) {
  // Simple terminator: overlay a shifted disk to reveal `fraction` of the lit face.
  // offset=0 (new moon) keeps the dark disk centered over the light one; offset=36
  // (full moon, 2x radius) slides it fully clear of the 40px disk.
  const offset = fraction * 36;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10">
        <circle cx="20" cy="20" r="18" className="fill-ink" />
        <circle cx={20 + offset} cy="20" r="18" className="fill-ground" />
        <circle cx="20" cy="20" r="18" className="fill-none stroke-rule" strokeWidth="1" />
      </svg>
      <div className="font-mono text-sm">
        <div className="text-ink">{phaseName}</div>
        <div className="text-muted">{Math.round(fraction * 100)}% lit</div>
        <div className="text-muted">{moonTimesLine(rise, set, alwaysUp, alwaysDown)}</div>
      </div>
    </div>
  );
}
