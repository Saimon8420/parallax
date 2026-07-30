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
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[640px]">
      {/* orbit rings */}
      {ringRadii(frame, positions).map((r, i) => (
        <circle key={i} cx={C} cy={C} r={r} className="fill-none stroke-orbit" strokeWidth={0.8} />
      ))}
      {/* center marker: you (earth) / sun (helio), accent */}
      <circle cx={C} cy={C} r={frame === "earth" ? 4 : 6} className="fill-accent" />
      {marks}
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
