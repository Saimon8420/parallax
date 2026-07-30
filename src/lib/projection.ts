export type Frame = "earth" | "helio";

/** Polar to SVG cartesian. 0deg = east (right); angle increases counter-clockwise; SVG y is inverted. */
export function polarToXY(cx: number, cy: number, radius: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(a), y: cy - radius * Math.sin(a) };
}

/** Evenly spaced radii for N bodies ordered inner->outer (geocentric bands, avoids label pile-up). */
export function bandRadii(n: number, rInner: number, rOuter: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [(rInner + rOuter) / 2];
  const step = (rOuter - rInner) / (n - 1);
  return Array.from({ length: n }, (_, i) => rInner + step * i);
}

/** Log-compressed radius so inner planets don't collapse into the Sun (heliocentric view). */
export function logRadius(distAu: number, maxAu: number, rInner: number, rOuter: number): number {
  if (maxAu <= 0) return rInner;
  const t = Math.log(distAu + 1) / Math.log(maxAu + 1);
  return rInner + t * (rOuter - rInner);
}
