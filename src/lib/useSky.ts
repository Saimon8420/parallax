import { useEffect, useState } from "react";
import type { CalendarMonth, Location, MoonPhaseEvent, Positions, SkyOverview, SunPosition } from "./types";
import { fetchPositions } from "./orreryClient";
import { fetchCalendar, fetchMoonPhases, fetchOverview, fetchSunPosition } from "./horizonClient";

export function useSky(loc: Location) {
  const [positions, setPositions] = useState<Positions | null>(null);
  const [overview, setOverview] = useState<SkyOverview | null>(null);
  const [posError, setPosError] = useState<string | null>(null);
  const [skyError, setSkyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);
  const [sunPositionError, setSunPositionError] = useState<string | null>(null);
  const [moonPhases, setMoonPhases] = useState<MoonPhaseEvent[] | null>(null);
  const [moonPhasesError, setMoonPhasesError] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<CalendarMonth | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let alive = true;
    const loadLive = () => {
      // Positions and sun position are both "right now" readings — refresh together.
      setPosError(null);
      fetchPositions(loc, ac.signal)
        .then((p) => alive && setPositions(p))
        .catch(() => alive && setPosError("orrery signal lost"));
      setSunPositionError(null);
      fetchSunPosition(loc, ac.signal)
        .then((sp) => alive && setSunPosition(sp))
        .catch(() => alive && setSunPositionError("sun position signal lost"));
    };
    setLoading(true);
    Promise.all([
      fetchPositions(loc, ac.signal).then((p) => alive && setPositions(p)).catch(() => alive && setPosError("orrery signal lost")),
      fetchOverview(loc, ac.signal).then((o) => alive && setOverview(o)).catch(() => alive && setSkyError("horizon signal lost")),
      fetchSunPosition(loc, ac.signal).then((sp) => alive && setSunPosition(sp)).catch(() => alive && setSunPositionError("sun position signal lost")),
      fetchMoonPhases(loc, undefined, ac.signal).then((mp) => alive && setMoonPhases(mp)).catch(() => alive && setMoonPhasesError("moon phases signal lost")),
      fetchCalendar(loc, undefined, ac.signal).then((c) => alive && setCalendar(c)).catch(() => alive && setCalendarError("calendar signal lost")),
    ]).finally(() => alive && setLoading(false));

    const id = setInterval(loadLive, 60_000); // "now" refresh: positions + sun position
    return () => { alive = false; ac.abort(); clearInterval(id); };
  }, [loc.lat, loc.lng]);

  return {
    positions, overview, posError, skyError, loading,
    sunPosition, sunPositionError,
    moonPhases, moonPhasesError,
    calendar, calendarError,
  };
}
