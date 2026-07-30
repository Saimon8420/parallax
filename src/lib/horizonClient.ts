import type { Location, SkyOverview, SkyTime } from "./types";
import { ApiError } from "./apiError";

const BASE = import.meta.env.VITE_HORIZON_URL ?? "https://horizon-prod-lk.vercel.app";
const t = (v: any): SkyTime | null =>
  v && typeof v.iso === "string" ? { iso: v.iso, time24: v.time24, time12: v.time12 } : null;

export function normalizeOverview(json: unknown): SkyOverview {
  const j = json as any;
  if (!j?.success || !j.data?.sun || !j.data?.moon) {
    throw new ApiError("horizon", 502, "horizon: non-success or malformed envelope");
  }
  const s = j.data.sun, m = j.data.moon;
  return {
    sunrise: t(s.sunrise),
    sunset: t(s.sunset),
    solarNoon: t(s.solarNoon),
    goldenEvening: { start: t(s.goldenHour?.evening?.start), end: t(s.goldenHour?.evening?.end) },
    civilDawn: t(s.twilight?.civilDawn),
    civilDusk: t(s.twilight?.civilDusk),
    dayLength: s.dayLength ? { seconds: s.dayLength.seconds, formatted: s.dayLength.formatted } : null,
    moon: {
      rise: t(m.rise),
      set: t(m.set),
      alwaysUp: !!m.alwaysUp,
      alwaysDown: !!m.alwaysDown,
      illuminationFraction: m.illumination?.fraction ?? 0,
      phaseName: m.illumination?.phaseName ?? "",
    },
  };
}

export async function fetchOverview(loc: Location, signal?: AbortSignal): Promise<SkyOverview> {
  const res = await fetch(`${BASE}/v1/overview?lat=${loc.lat}&lng=${loc.lng}`, { signal });
  if (!res.ok) throw new ApiError("horizon", res.status);
  return normalizeOverview(await res.json());
}
