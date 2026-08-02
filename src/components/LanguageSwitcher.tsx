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
      className="rounded-full border border-white/10 bg-card/60 p-1 font-mono text-[11px] backdrop-blur-sm"
    >
      <ToggleGroupItem value="en" className="rounded-full px-3 data-[state=on]:bg-accent data-[state=on]:text-ground">
        {t.switcher.en}
      </ToggleGroupItem>
      <ToggleGroupItem value="bn" className="rounded-full px-3 data-[state=on]:bg-accent data-[state=on]:text-ground">
        {t.switcher.bn}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
