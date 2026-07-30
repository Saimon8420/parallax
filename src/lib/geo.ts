import type { Location } from "./types";
import { CITIES } from "./cities";

export const DEFAULT_LOCATION: Location = { label: "Dhaka, Bangladesh", lat: 23.81, lng: 90.41 };
const KEY = "parallax.location";

export function searchCities(query: string, limit = 6): Location[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter((c) => c.label.toLowerCase().includes(q)).slice(0, limit);
}

export function saveLocation(loc: Location): void {
  localStorage.setItem(KEY, JSON.stringify(loc));
}
export function loadLocation(): Location | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Location; } catch { return null; }
}

export function geolocate(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("geolocation unavailable"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: +pos.coords.latitude.toFixed(4),
        lng: +pos.coords.longitude.toFixed(4),
        label: "Your location",
      }),
      (err) => reject(err),
      { timeout: 8000 },
    );
  });
}
