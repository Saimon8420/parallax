import { useEffect, useState } from "react";
import type { Location, Positions, SkyOverview } from "./types";
import { fetchPositions } from "./orreryClient";
import { fetchOverview } from "./horizonClient";

export function useSky(loc: Location) {
  const [positions, setPositions] = useState<Positions | null>(null);
  const [overview, setOverview] = useState<SkyOverview | null>(null);
  const [posError, setPosError] = useState<string | null>(null);
  const [skyError, setSkyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    let alive = true;
    const loadPositions = () => {
      setPosError(null);
      fetchPositions(loc, ac.signal)
        .then((p) => alive && setPositions(p))
        .catch(() => alive && setPosError("orrery signal lost"));
    };
    setLoading(true);
    Promise.all([
      fetchPositions(loc, ac.signal).then(setPositions).catch(() => setPosError("orrery signal lost")),
      fetchOverview(loc, ac.signal).then(setOverview).catch(() => setSkyError("horizon signal lost")),
    ]).finally(() => alive && setLoading(false));

    const id = setInterval(loadPositions, 60_000); // "now" refresh
    return () => { alive = false; ac.abort(); clearInterval(id); };
  }, [loc.lat, loc.lng]);

  return { positions, overview, posError, skyError, loading };
}
