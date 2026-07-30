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

/** Map a body's horizontal position (altitude/azimuth, deg) onto the SunArc 200x70 dome.
 * Azimuth 90(E)->x10 .. 270(W)->x190 across the southern dome; altitude 0..90 -> baseline60..apex10.
 * Northern-hemisphere-facing dome: a body north of the observer (azimuth <90 or >270) reads not-visible. */
export function skyPosition(altitudeDeg: number, azimuthDeg: number) {
  const x = 10 + ((azimuthDeg - 90) / 180) * 180;
  const y = 60 - (Math.max(0, Math.min(90, altitudeDeg)) / 90) * 50;
  const visible = altitudeDeg > 0 && azimuthDeg >= 90 && azimuthDeg <= 270;
  return { x, y, visible };
}
