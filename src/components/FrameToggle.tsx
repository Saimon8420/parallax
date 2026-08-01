import type { Frame } from "../lib/projection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FrameToggle({ value, onChange, showCaption = true }: {
  value: Frame; onChange: (f: Frame) => void; showCaption?: boolean;
}) {
  return (
    <div className="flex flex-col items-end gap-2">
      <ToggleGroup type="single" value={value}
        onValueChange={(v) => v && onChange(v as Frame)}
        className="rounded-full border border-white/10 bg-card/60 p-1 font-mono text-xs backdrop-blur-sm">
        <ToggleGroupItem value="earth" className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-ground">FROM EARTH</ToggleGroupItem>
        <ToggleGroupItem value="helio" className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-ground">FROM ABOVE</ToggleGroupItem>
      </ToggleGroup>
      {showCaption && (
        <p className="max-w-xs text-right font-mono text-[11px] leading-snug text-muted">
          Two honest viewpoints — they don’t line up, and that’s correct physics.
        </p>
      )}
    </div>
  );
}
