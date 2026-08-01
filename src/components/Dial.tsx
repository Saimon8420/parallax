import type { BodyKey, Positions } from "../lib/types";
import type { Frame } from "../lib/projection";
import { polarToXY, bandRadii, logRadius } from "../lib/projection";
import { BODY_META } from "../lib/bodies";
import { BodyMark } from "./BodyMark";

const SIZE = 640, C = SIZE / 2, R_IN = 70, R_OUT = 280;

export function Dial({ frame, positions, onSelect }: {
  frame: Frame; positions: Positions; onSelect: (k: BodyKey) => void;
}) {
  const marks =
    frame === "earth" ? earthMarks(positions, onSelect) : helioMarks(positions, onSelect);
  const rings = ringRadii(frame, positions);
  const centerLabel = frame === "earth" ? "YOU" : "SUN";
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[560px]">
      <defs>
        <radialGradient id="dial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#ff7a45" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={R_OUT} fill="url(#dial-glow)" />

      {/* orbit / band rings */}
      {rings.map((r, i) => (
        <circle key={i} cx={C} cy={C} r={r} className="fill-none stroke-orbit" strokeWidth={0.8} />
      ))}
      {/* emphasised ecliptic ring + label */}
      <circle cx={C} cy={C} r={R_OUT} className="fill-none stroke-muted" strokeWidth={1} strokeOpacity={0.5} />
      <text x={C + R_OUT - 6} y={C - 8} className="fill-faint font-mono" fontSize="11" textAnchor="end">ecliptic</text>

      {/* ecliptic longitude ticks */}
      {[0, 90, 180, 270].map((deg) => {
        const p = polarToXY(C, C, R_OUT + 20, deg);
        return (
          <text key={deg} x={p.x} y={p.y + 3} className="fill-muted font-mono" fontSize="11" textAnchor="middle">
            {deg}°
          </text>
        );
      })}

      {marks}

      {/* centre marker: you (earth) / sun (helio) */}
      <circle cx={C} cy={C} r={16} className="fill-none stroke-accent" strokeWidth={1} strokeOpacity={0.5} />
      <circle cx={C} cy={C} r={frame === "earth" ? 7 : 9} className="fill-accent" />
      <text x={C} y={C + 30} className="fill-ink font-display" fontSize="13" fontWeight="700" textAnchor="middle">
        {centerLabel}
      </text>
    </svg>
  );
}

function ringRadii(frame: Frame, p: Positions): number[] {
  if (frame === "earth") return bandRadii(p.geo.length, R_IN, R_OUT);
  const helio = p.helio.filter((b) => b.key !== "pluto");
  const max = Math.max(...helio.map((b) => b.heliocentricDistanceAu), 1);
  return helio.map((b) => logRadius(b.heliocentricDistanceAu, max, R_IN, R_OUT));
}

function earthMarks(p: Positions, onSelect: (k: BodyKey) => void) {
  const ordered = [...p.geo].sort((a, b) => a.distanceAu - b.distanceAu);
  const radii = bandRadii(ordered.length, R_IN, R_OUT);
  return ordered.map((b, i) => {
    const { x, y } = polarToXY(C, C, radii[i], b.eclipticLongitude);
    return (
      <BodyMark key={b.key} bodyKey={b.key} x={x} y={y}
        label={BODY_META[b.key].label} accent={false} onSelect={onSelect} />
    );
  });
}

function helioMarks(p: Positions, onSelect: (k: BodyKey) => void) {
  const helio = p.helio.filter((b) => b.key !== "pluto");
  const max = Math.max(...helio.map((b) => b.heliocentricDistanceAu), 1);
  return helio.map((b) => {
    const r = logRadius(b.heliocentricDistanceAu, max, R_IN, R_OUT);
    const { x, y } = polarToXY(C, C, r, b.heliocentricLongitude);
    return (
      <BodyMark key={b.key} bodyKey={b.key} x={x} y={y}
        label={BODY_META[b.key].label} accent={b.key === "earth"} onSelect={onSelect} />
    );
  });
}
