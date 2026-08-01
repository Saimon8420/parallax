import type { SkyOverview, SkyTime, SunPosition } from "./types";

/** A run of lede text; `b` marks a value to emphasise. */
export interface Segment { t: string; b?: boolean }

const COMPASS_16 = [
  "north", "north-northeast", "northeast", "east-northeast",
  "east", "east-southeast", "southeast", "south-southeast",
  "south", "south-southwest", "southwest", "west-southwest",
  "west", "west-northwest", "northwest", "north-northwest",
];

const COMPASS_ABBR = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

function compassIndex(azimuthDeg: number): number {
  return Math.round((((azimuthDeg % 360) + 360) % 360) / 22.5) % 16;
}

/** Azimuth (° clockwise from true north) → spoken 16-point compass name. */
export function compassName(azimuthDeg: number): string {
  return COMPASS_16[compassIndex(azimuthDeg)]!;
}

/** Azimuth → abbreviated compass point, e.g. 282 → "WNW". */
export function compassAbbr(azimuthDeg: number): string {
  return COMPASS_ABBR[compassIndex(azimuthDeg)]!;
}

export type SkyTier = "day" | "golden" | "night";

/** Which visual tier the sky is in, from the Sun's altitude / up-state. */
export function skyTier(altitudeDeg: number | null, isUp: boolean): SkyTier {
  if (altitudeDeg === null) return isUp ? "day" : "night";
  if (altitudeDeg < -6) return "night";
  if (altitudeDeg < 12) return "golden";
  return "day";
}

/**
 * CSS background for the hero band. The TOP is always deep navy (so light lede
 * text stays legible); only the horizon glow changes with the tier.
 */
export function skyGradient(altitudeDeg: number | null, isUp: boolean): string {
  const tier = skyTier(altitudeDeg, isUp);
  if (tier === "day") {
    return "radial-gradient(120% 150% at 78% 108%, rgba(120,170,255,.45), rgba(90,140,230,.10) 34%, transparent 56%), " +
      "linear-gradient(180deg, #0a1230 0%, #1b336b 46%, #3f6bb0 78%, #8fb6e6 98%)";
  }
  if (tier === "golden") {
    return "radial-gradient(120% 150% at 78% 108%, rgba(255,150,80,.55), rgba(255,120,70,.12) 32%, transparent 55%), " +
      "linear-gradient(180deg, #0a1230 0%, #16244f 40%, #2d3d6b 66%, #6b5a78 84%, #b5744f 96%)";
  }
  return "radial-gradient(120% 150% at 78% 112%, rgba(70,90,150,.25), transparent 52%), " +
    "linear-gradient(180deg, #04060f 0%, #070b1c 55%, #0b1230 82%, #12183a 100%)";
}

/** Place a body in the hero band from its altitude/azimuth. Returns CSS %. */
export function skyPlot(altitudeDeg: number, azimuthDeg: number): { leftPct: number; topPct: number } {
  const HORIZON = 82, APEX = 10; // % from top: horizon line vs zenith
  const leftPct = Math.max(4, Math.min(96, 8 + ((azimuthDeg - 90) / 180) * 84));
  const alt = Math.max(0, Math.min(90, altitudeDeg));
  const topPct = HORIZON - (alt / 90) * (HORIZON - APEX);
  return { leftPct, topPct };
}

/** "1h 29m" until `targetISO`, or null if it is already past `now`. */
export function humanUntil(targetISO: string | null | undefined, now: Date): string | null {
  if (!targetISO) return null;
  const diff = Date.parse(targetISO) - now.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return null;
  let h = Math.floor(diff / 3_600_000);
  let m = Math.round((diff % 3_600_000) / 60_000);
  if (m === 60) { h += 1; m = 0; }
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function pct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** Plain-language description of the sky right now, as emphasised segments. */
export function describeSky(
  overview: SkyOverview,
  sunPosition: SunPosition | null | undefined,
  now: Date,
): { sun: Segment[]; moon: Segment[] } {
  return { sun: sunSentence(overview, sunPosition, now), moon: moonSentence(overview) };
}

function sunSentence(overview: SkyOverview, sun: SunPosition | null | undefined, now: Date): Segment[] {
  if (sun && sun.isUp) {
    const until = humanUntil(overview.sunset?.iso, now);
    const seg: Segment[] = [
      { t: "The Sun hangs " },
      { t: `${Math.round(sun.altitude)}°`, b: true },
      { t: " over the " },
      { t: compassName(sun.azimuth), b: true },
    ];
    if (until) seg.push({ t: ", setting in " }, { t: until, b: true }, { t: "." });
    else if (overview.sunset) seg.push({ t: ", setting at " }, { t: overview.sunset.time24, b: true }, { t: "." });
    else seg.push({ t: "." });
    return seg;
  }
  // Sun is down: before sunrise vs after sunset.
  if (overview.sunrise && now.getTime() < Date.parse(overview.sunrise.iso)) {
    return [{ t: "The Sun is below the horizon — it rises at " }, { t: overview.sunrise.time24, b: true }, { t: "." }];
  }
  if (overview.sunset) {
    return [{ t: "The Sun set at " }, { t: overview.sunset.time24, b: true }, { t: " — it’s night." }];
  }
  return [{ t: "The Sun is below the horizon." }];
}

function moonSentence(overview: SkyOverview): Segment[] {
  const m = overview.moon;
  const desc = `${pct(m.illuminationFraction)}-lit ${m.phaseName.toLowerCase()}`;
  if (m.alwaysUp) return [{ t: "A " }, { t: desc, b: true }, { t: " Moon is up all night." }];
  if (m.alwaysDown) return [{ t: "A " }, { t: desc, b: true }, { t: " Moon stays below the horizon." }];
  const up = m.position.altitude > 0;
  if (up) {
    const seg: Segment[] = [{ t: "A " }, { t: desc, b: true }, { t: " Moon is up" }];
    if (m.set) seg.push({ t: ", setting at " }, { t: m.set.time24, b: true });
    seg.push({ t: "." });
    return seg;
  }
  const seg: Segment[] = [{ t: "The " }, { t: desc, b: true }, { t: " Moon is still below the horizon" }];
  if (m.rise) seg.push({ t: " — it rises at " }, { t: m.rise.time24, b: true });
  seg.push({ t: "." });
  return seg;
}

/** Join segments into plain text (for a11y / tests). */
export function segmentText(segments: Segment[]): string {
  return segments.map((s) => s.t).join("");
}

/**
 * Project altitude/azimuth onto a top-down sky radar centred at (cx,cy) with
 * horizon at radius R. North is up, bearing increases clockwise; the zenith
 * (90° altitude) sits at the centre, the horizon (0°) at the edge.
 */
export function compassRadar(cx: number, cy: number, R: number, altitudeDeg: number, azimuthDeg: number): { x: number; y: number } {
  const alt = Math.max(0, Math.min(90, altitudeDeg));
  const r = R * (1 - alt / 90);
  const a = ((azimuthDeg - 90) * Math.PI) / 180; // azimuth 0°=N → straight up
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Which body the live tracker should follow right now, and its state. */
export type ActiveBody =
  | { kind: "sun"; altitude: number; azimuth: number }
  | { kind: "moon"; altitude: number; azimuth: number; illumination: number; phaseName: string }
  | { kind: "next"; body: "sun" | "moon"; risesAt: SkyTime }
  | { kind: "rest" };

/** Sun by day, Moon by night; when both are down, the next body to rise. */
export function activeSkyBody(overview: SkyOverview, sun: SunPosition | null | undefined, now: Date): ActiveBody {
  if (sun && sun.isUp) return { kind: "sun", altitude: sun.altitude, azimuth: sun.azimuth };

  const m = overview.moon;
  if (m.alwaysUp || m.position.altitude > 0) {
    return {
      kind: "moon",
      altitude: Math.max(m.position.altitude, 0),
      azimuth: m.position.azimuth,
      illumination: m.illuminationFraction,
      phaseName: m.phaseName,
    };
  }

  const nowMs = now.getTime();
  const cands: { body: "sun" | "moon"; t: SkyTime }[] = [];
  if (overview.sunrise && Date.parse(overview.sunrise.iso) > nowMs) cands.push({ body: "sun", t: overview.sunrise });
  if (m.rise && Date.parse(m.rise.iso) > nowMs) cands.push({ body: "moon", t: m.rise });
  if (cands.length === 0) return { kind: "rest" };
  cands.sort((a, b) => Date.parse(a.t.iso) - Date.parse(b.t.iso));
  return { kind: "next", body: cands[0]!.body, risesAt: cands[0]!.t };
}
