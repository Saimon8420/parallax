import type { BodyKey, GeoBody, HelioBody, Location, Positions } from "./types";
import { ApiError } from "./apiError";

const BASE = import.meta.env.VITE_ORRERY_URL ?? "https://orrery-dev.vercel.app";

export function normalizePositions(geoJson: unknown, helioJson: unknown): Positions {
  const geoData = (geoJson as any)?.data;
  const helioData = (helioJson as any)?.data;
  if (!geoData?.bodies || !Array.isArray(geoData.bodies)) {
    throw new ApiError("orrery", 502, "orrery: malformed positions envelope");
  }
  const geo: GeoBody[] = geoData.bodies.map((b: any) => ({
    key: b.body as BodyKey,
    eclipticLongitude: b.eclipticLongitude,
    distanceAu: b.distanceAu,
    constellation: b.constellation,
    magnitude: b.magnitude ?? null,
    illuminatedFraction: b.illuminatedFraction ?? 1,
    phase: b.phase ?? "",
    altitude: b.altitude,
    azimuth: b.azimuth,
    aboveHorizon: b.aboveHorizon,
  }));
  const helio: HelioBody[] = (helioData?.bodies ?? []).map((b: any) => ({
    key: b.body as BodyKey,
    heliocentricLongitude: b.heliocentricLongitude,
    heliocentricDistanceAu: b.heliocentricDistanceAu,
  }));
  return { datetime: geoData.datetime, geo, helio };
}

/** Heliocentric endpoint is not yet deployed everywhere — best-effort only, never throws. */
async function fetchHelioBestEffort(signal?: AbortSignal): Promise<unknown> {
  try {
    const res = await fetch(`${BASE}/v1/positions/heliocentric`, { signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPositions(loc: Location, signal?: AbortSignal): Promise<Positions> {
  const q = `lat=${loc.lat}&lon=${loc.lng}`;
  const [geoRes, helioJson] = await Promise.all([
    fetch(`${BASE}/v1/positions?${q}`, { signal }),
    fetchHelioBestEffort(signal),
  ]);
  if (!geoRes.ok) throw new ApiError("orrery", geoRes.status);
  return normalizePositions(await geoRes.json(), helioJson);
}
