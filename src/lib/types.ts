export type BodyKey =
  | "sun" | "moon" | "mercury" | "venus" | "earth" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";

export interface GeoBody {
  key: BodyKey;
  eclipticLongitude: number;
  distanceAu: number;
  constellation: string;
  magnitude: number | null;
  illuminatedFraction: number;
  phase: string;
  altitude?: number;
  azimuth?: number;
  aboveHorizon?: boolean;
}
export interface HelioBody {
  key: BodyKey;
  heliocentricLongitude: number;
  heliocentricDistanceAu: number;
}
export interface Positions {
  datetime: string;
  geo: GeoBody[];
  helio: HelioBody[];
}
export interface SkyTime { iso: string; time24: string; time12: string; }
export interface MoonInfo {
  rise: SkyTime | null;
  set: SkyTime | null;
  alwaysUp: boolean;
  alwaysDown: boolean;
  illuminationFraction: number;
  phaseName: string;
}
export interface SkyOverview {
  sunrise: SkyTime | null;
  sunset: SkyTime | null;
  solarNoon: SkyTime | null;
  goldenEvening: { start: SkyTime | null; end: SkyTime | null };
  civilDawn: SkyTime | null;
  civilDusk: SkyTime | null;
  dayLength: { seconds: number; formatted: string } | null;
  moon: MoonInfo;
}
export interface Location { lat: number; lng: number; label: string; }
