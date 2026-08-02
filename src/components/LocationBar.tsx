import { useState } from "react";
import type { Location } from "../lib/types";
import { searchCities, geolocate } from "../lib/geo";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLang } from "../i18n/useLang";

export function LocationBar({ current, onPick }: { current: Location; onPick: (l: Location) => void }) {
  const [q, setQ] = useState("");
  const results = searchCities(q);
  const { t } = useLang();
  return (
    <div className="flex items-center gap-2 font-mono text-[13px]">
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label={t.location.change}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-ink backdrop-blur-sm transition hover:border-white/30">
            <span className="text-accent">◉</span>
            {current.label}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-2 border-rule bg-card">
          <input autoFocus placeholder={t.location.search} value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-rule bg-ground px-2 py-1.5 text-ink outline-none focus:border-accent" />
          <ul>
            {results.map((c) => (
              <li key={c.label}>
                <button className="w-full rounded px-1 py-1 text-left hover:text-accent" onClick={() => onPick(c)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="w-full justify-start text-muted"
            onClick={() => geolocate().then(onPick).catch(() => {})}>
            {t.location.useMine}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
