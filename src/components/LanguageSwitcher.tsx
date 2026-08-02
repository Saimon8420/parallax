import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLang } from "../i18n/useLang";
import type { Lang } from "../i18n/types";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <ToggleGroup
      type="single"
      value={lang}
      onValueChange={(v) => v && setLang(v as Lang)}
      aria-label={t.switcher.aria}
      className="h-9 items-center rounded-full border border-white/15 bg-white/10 p-0.5 font-mono text-[11px] backdrop-blur-sm"
    >
      <ToggleGroupItem value="en" className="h-8 rounded-full px-3.5 data-[state=on]:bg-accent data-[state=on]:text-ground">
        {t.switcher.en}
      </ToggleGroupItem>
      <ToggleGroupItem value="bn" className="h-8 rounded-full px-3.5 data-[state=on]:bg-accent data-[state=on]:text-ground">
        {t.switcher.bn}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
