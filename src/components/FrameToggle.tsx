import type { Frame } from "../lib/projection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLang } from "../i18n/useLang";

export function FrameToggle({ value, onChange, showCaption = true }: {
  value: Frame; onChange: (f: Frame) => void; showCaption?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-end gap-2">
      <ToggleGroup type="single" value={value}
        onValueChange={(v) => v && onChange(v as Frame)}
        className="rounded-full border border-white/10 bg-card/60 p-1 font-mono text-xs backdrop-blur-sm">
        <ToggleGroupItem value="earth" className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-ground">{t.frame.fromEarth}</ToggleGroupItem>
        <ToggleGroupItem value="helio" className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-ground">{t.frame.fromAbove}</ToggleGroupItem>
      </ToggleGroup>
      {showCaption && (
        <p className="max-w-xs text-right font-mono text-[11px] leading-snug text-muted">{t.frame.caption}</p>
      )}
    </div>
  );
}
