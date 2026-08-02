export type Lang = "en" | "bn";

export interface Dict {
  brand: { tagline: string };
  switcher: { en: string; bn: string; aria: string };
  sections: { zoomOut: string; todayDetail: string; moonPhases: string };
  dial: { centreHint: string; helioUnavailable: string; plotting: string; ecliptic: string; you: string; sun: string };
  status: { readingSky: string; retrying: string };
  errors: { moonPhases: string; calendar: string; sunPosition: string };
  footer: { dataNote: string; local: string; computedAt: string };
  hero: { kicker: string; sunriseE: string; horizon: string; sunsetW: string; ariaLabel: string };
  compass: string[];       // 16 full names
  compassAbbr: string[];   // 16 short forms
  rose: { n: string; e: string; s: string; w: string; zenith: string };
  compassPill: {
    nowTracking: string; nextUp: string; theSun: string; theMoon: string; theSky: string;
    resting: string; ariaPrefix: string; lit: string; rises: string; upDeg: string; below: string;
  };
  stat: { sunset: string; goldenHour: string; dayLength: string; moonrise: string; moon: string; up: string };
  legend: { title: string; up: string; below: string; brand: string; def: string; fromEarth: string; rest: string };
  cards: {
    sun: string; twilight: string; moon: string;
    sunrise: string; solarNoon: string; sunset: string; goldenHour: string; dayLength: string;
    civil: string; nautical: string; astronomical: string; firstLight: string; lastLight: string;
    distance: string; position: string; upAlt: string; belowAz: string; km: string;
  };
  moonGlyph: { lit: string; upAllDay: string; downAllDay: string; rise: string; set: string; az: string; alt: string };
  bodyDetail: {
    eclipticLongitude: string; distance: string; constellation: string; magnitude: string;
    phase: string; altitude: string; azimuth: string; close: string;
  };
  moonPhasesLabels: { today: string; inOneDay: string; inDays: string }; // inDays: "{n} দিন পর" template with {n}
  calendar: { monthly: string; legendHint: string; show: string; hide: string };
  location: { change: string; search: string; useMine: string };
  frame: { fromEarth: string; fromAbove: string; caption: string };
  units: { hourLong: string; minuteLong: string };
  bodies: Record<"sun" | "mercury" | "venus" | "earth" | "moon" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto", string>;
  moonPhases: Record<string, string>;
  weekdays: string[];  // 7, Sun-first
  months: string[];    // 12, Jan-first
}
