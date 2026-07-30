import type { Frame } from "../lib/projection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FrameToggle({ value, onChange }: { value: Frame; onChange: (f: Frame) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <ToggleGroup type="single" value={value}
        onValueChange={(v) => v && onChange(v as Frame)} className="font-mono">
        <ToggleGroupItem value="earth">FROM EARTH</ToggleGroupItem>
        <ToggleGroupItem value="helio">FROM ABOVE</ToggleGroupItem>
      </ToggleGroup>
      <p className="max-w-xs font-mono text-[11px] leading-snug text-muted">
        The two views don’t line up — a planet’s place in Earth’s sky differs from its
        orbital angle around the Sun. That’s correct physics, not a glitch.
      </p>
    </div>
  );
}
