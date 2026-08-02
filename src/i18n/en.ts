import type { Dict } from "./types";

export const en: Dict = {
  brand: { tagline: "your sky, right now" },
  switcher: { en: "EN", bn: "বাংলা", aria: "Language" },
  sections: {
    zoomOut: "Zoom out — the whole sky, two honest views",
    todayDetail: "Today in detail",
    moonPhases: "Upcoming moon phases",
  },
  dial: {
    centreHint: "You’re at the centre. Angle = direction in your sky; ring = distance out along the ecliptic.",
    helioUnavailable: "Heliocentric data unavailable",
    plotting: "plotting positions…",
    ecliptic: "ecliptic",
    you: "YOU",
    sun: "SUN",
  },
  status: { readingSky: "reading your sky…", retrying: "retrying…" },
  errors: {
    moonPhases: "moon phases unavailable",
    calendar: "calendar unavailable",
    sunPosition: "live sun position unavailable",
  },
  footer: {
    dataNote: "data: Horizon + Orrery APIs · positions are live",
    local: "local",
    computedAt: "computed at",
  },
  hero: { kicker: "Your sky", sunriseE: "sunrise", horizon: "the horizon", sunsetW: "sunset", ariaLabel: "Your sky right now" },
  compass: [
    "north", "north-northeast", "northeast", "east-northeast",
    "east", "east-southeast", "southeast", "south-southeast",
    "south", "south-southwest", "southwest", "west-southwest",
    "west", "west-northwest", "northwest", "north-northwest",
  ],
  compassAbbr: [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ],
  rose: { n: "N", e: "E", s: "S", w: "W", zenith: "zenith" },
  compassPill: {
    nowTracking: "Now tracking", nextUp: "Next up:", theSun: "the Sun", theMoon: "the Moon",
    theSky: "the sky", resting: "resting — nothing above the horizon", ariaPrefix: "Sky compass",
    lit: "lit", rises: "rises", upDeg: "up", below: "below",
  },
  stat: { sunset: "Sunset", goldenHour: "Golden hour", dayLength: "Day length", moonrise: "Moonrise", moon: "Moon", up: "up" },
  legend: {
    title: "What’s in your sky now", up: "up", below: "below",
    brand: "Parallax", def: "= the shift when you change viewpoint.", fromEarth: "From Earth",
    rest: "shows where things sit in your sky; the overhead view looks down on the whole solar system. They don’t line up — and that’s the point.",
  },
  cards: {
    sun: "Sun", twilight: "Twilight", moon: "Moon",
    sunrise: "Sunrise", solarNoon: "Solar noon", sunset: "Sunset", goldenHour: "Golden hour", dayLength: "Day length",
    civil: "Civil", nautical: "Nautical", astronomical: "Astronomical", firstLight: "First light", lastLight: "Last light",
    distance: "Distance", position: "Position", upAlt: "up · alt", belowAz: "below · az", km: "km",
  },
  moonGlyph: { lit: "lit", upAllDay: "up all day", downAllDay: "down all day", rise: "rise", set: "set", az: "az", alt: "alt" },
  bodyDetail: {
    eclipticLongitude: "ecliptic longitude", distance: "distance", constellation: "constellation", magnitude: "magnitude",
    phase: "phase", altitude: "altitude", azimuth: "azimuth", close: "close ✕",
  },
  moonPhasesLabels: { today: "today", inOneDay: "in 1 day", inDays: "in {n} days" },
  calendar: { monthly: "monthly calendar", legendHint: "sunrise ↑ · sunset ↓ · moon", show: "Show", hide: "Hide" },
  location: { change: "change location", search: "Search city…", useMine: "use my location" },
  frame: {
    fromEarth: "FROM EARTH", fromAbove: "FROM ABOVE",
    caption: "Two honest viewpoints — they don’t line up, and that’s correct physics.",
  },
  units: { hourLong: "h", minuteLong: "m" },
  bodies: {
    sun: "Sun", mercury: "Mercury", venus: "Venus", earth: "Earth", moon: "Moon", mars: "Mars",
    jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
  },
  moonPhases: {
    "New Moon": "New Moon", "Waxing Crescent": "Waxing Crescent", "First Quarter": "First Quarter",
    "Waxing Gibbous": "Waxing Gibbous", "Full Moon": "Full Moon", "Waning Gibbous": "Waning Gibbous",
    "Last Quarter": "Last Quarter", "Waning Crescent": "Waning Crescent",
  },
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
