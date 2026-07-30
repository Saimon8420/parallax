import type {
  Location,
  SkyOverview,
  SkyTime,
  SunPosition,
  MoonPhaseEvent,
  CalendarMonth,
} from "./types";
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
    twilight: {
      civilDawn: t(s.twilight?.civilDawn),
      civilDusk: t(s.twilight?.civilDusk),
      nauticalDawn: t(s.twilight?.nauticalDawn),
      nauticalDusk: t(s.twilight?.nauticalDusk),
      astroDawn: t(s.twilight?.astronomicalDawn),
      astroDusk: t(s.twilight?.astronomicalDusk),
    },
    moon: {
      rise: t(m.rise),
      set: t(m.set),
      alwaysUp: !!m.alwaysUp,
      alwaysDown: !!m.alwaysDown,
      illuminationFraction: m.illumination?.fraction ?? 0,
      phaseName: m.illumination?.phaseName ?? "",
      position: {
        azimuth: m.position?.azimuth ?? 0,
        altitude: m.position?.altitude ?? 0,
        distanceKm: m.position?.distanceKm ?? 0,
      },
    },
  };
}

export function normalizeSunPosition(json: unknown): SunPosition {
  const j = json as any;
  if (!j?.success || !j.data) {
    throw new ApiError("horizon", 502, "horizon: non-success or malformed envelope");
  }
  const d = j.data;
  return {
    azimuth: d.azimuth,
    altitude: d.altitude,
    isUp: !!d.isUp,
    time: t(d.time) as SkyTime,
  };
}

export function normalizeMoonPhases(json: unknown): MoonPhaseEvent[] {
  const j = json as any;
  if (!j?.success || !Array.isArray(j.data?.phases)) {
    throw new ApiError("horizon", 502, "horizon: non-success or malformed envelope");
  }
  const events: MoonPhaseEvent[] = j.data.phases.map((p: any) => ({
    phase: p.phase,
    utcISO: p.utc,
    dateLabel: p.date,
  }));
  // The API can emit two events for the same principal phase within ~2h.
  // Collapse events with equal `phase` whose `utc` are within 6h of the
  // previously kept event, keeping the first.
  const deduped: MoonPhaseEvent[] = [];
  for (const e of events) {
    const last = deduped[deduped.length - 1];
    const withinSixHours =
      last !== undefined &&
      last.phase === e.phase &&
      Math.abs(new Date(e.utcISO).getTime() - new Date(last.utcISO).getTime()) <= 6 * 60 * 60 * 1000;
    if (withinSixHours) continue;
    deduped.push(e);
  }
  return deduped;
}

export function normalizeCalendar(json: unknown): CalendarMonth {
  const j = json as any;
  if (!j?.success || !j.data || !Array.isArray(j.data.days)) {
    throw new ApiError("horizon", 502, "horizon: non-success or malformed envelope");
  }
  const d = j.data;
  return {
    year: d.year,
    month: d.month,
    days: d.days.map((day: any) => ({
      date: day.date,
      sunrise: t(day.sunrise),
      sunset: t(day.sunset),
      solarNoon: t(day.solarNoon),
      goldenHourEvening: t(day.goldenHourEvening),
      dayLength: day.dayLength ?? null,
      moonPhase: day.moonPhase,
      moonIllumination: day.moonIllumination,
    })),
  };
}

export async function fetchOverview(loc: Location, signal?: AbortSignal): Promise<SkyOverview> {
  const res = await fetch(`${BASE}/v1/overview?lat=${loc.lat}&lng=${loc.lng}`, { signal });
  if (!res.ok) throw new ApiError("horizon", res.status);
  return normalizeOverview(await res.json());
}

export async function fetchSunPosition(loc: Location, signal?: AbortSignal): Promise<SunPosition> {
  const res = await fetch(`${BASE}/v1/sun/position?lat=${loc.lat}&lng=${loc.lng}`, { signal });
  if (!res.ok) throw new ApiError("horizon", res.status);
  return normalizeSunPosition(await res.json());
}

export async function fetchMoonPhases(
  loc: Location,
  count?: number,
  signal?: AbortSignal,
): Promise<MoonPhaseEvent[]> {
  const params = new URLSearchParams({ lat: String(loc.lat), lng: String(loc.lng) });
  if (count !== undefined) params.set("count", String(count));
  const res = await fetch(`${BASE}/v1/moon/phases?${params.toString()}`, { signal });
  if (!res.ok) throw new ApiError("horizon", res.status);
  return normalizeMoonPhases(await res.json());
}

export async function fetchCalendar(
  loc: Location,
  opts?: { year?: number; month?: number },
  signal?: AbortSignal,
): Promise<CalendarMonth> {
  const params = new URLSearchParams({ lat: String(loc.lat), lng: String(loc.lng) });
  if (opts?.year !== undefined) params.set("year", String(opts.year));
  if (opts?.month !== undefined) params.set("month", String(opts.month));
  const res = await fetch(`${BASE}/v1/calendar/monthly?${params.toString()}`, { signal });
  if (!res.ok) throw new ApiError("horizon", res.status);
  return normalizeCalendar(await res.json());
}
