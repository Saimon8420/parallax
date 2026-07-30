import type { BodyKey } from "./types";
export const BODY_META: Record<BodyKey, { label: string; symbol: string; order: number }> = {
  sun: { label: "Sun", symbol: "☉", order: 0 },
  mercury: { label: "Mercury", symbol: "☿", order: 1 },
  venus: { label: "Venus", symbol: "♀", order: 2 },
  earth: { label: "Earth", symbol: "⊕", order: 3 },
  moon: { label: "Moon", symbol: "☾", order: 4 },
  mars: { label: "Mars", symbol: "♂", order: 5 },
  jupiter: { label: "Jupiter", symbol: "♃", order: 6 },
  saturn: { label: "Saturn", symbol: "♄", order: 7 },
  uranus: { label: "Uranus", symbol: "♅", order: 8 },
  neptune: { label: "Neptune", symbol: "♆", order: 9 },
  pluto: { label: "Pluto", symbol: "♇", order: 10 },
};
