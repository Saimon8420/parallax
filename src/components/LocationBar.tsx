import { useState } from "react";
import type { Location } from "../lib/types";
import { searchCities, geolocate } from "../lib/geo";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function LocationBar({ current, onPick }: { current: Location; onPick: (l: Location) => void }) {
  const [q, setQ] = useState("");
  const results = searchCities(q);
  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <span className="text-accent">◉</span>
      <span className="text-ink">{current.label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="text-muted">change location</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-2">
          <input autoFocus placeholder="Search city…" value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-ground border border-rule px-2 py-1 text-ink" />
          <ul>
            {results.map((c) => (
              <li key={c.label}>
                <button className="w-full text-left py-1 hover:text-accent" onClick={() => onPick(c)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="text-muted"
            onClick={() => geolocate().then(onPick).catch(() => {})}>
            use my location
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
