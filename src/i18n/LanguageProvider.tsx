import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./types";
import { DICT } from "./dict";
import { localizeDigits } from "./localizeDigits";
import { LanguageContext } from "./context";

const KEY = "parallax:lang";

function fromStorage(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "bn" || v === "en") return v;
  } catch { /* ignore */ }
  return "en";
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? fromStorage());
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  }, []);
  const value = useMemo(
    () => ({ lang, setLang, t: DICT[lang], n: (v: string | number) => localizeDigits(v, lang) }),
    [lang, setLang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
