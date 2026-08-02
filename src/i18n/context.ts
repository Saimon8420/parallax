import { createContext } from "react";
import type { Lang, Dict } from "./types";
import { DICT } from "./dict";

export interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  n: (v: string | number) => string;
}

export const LanguageContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: DICT.en,
  n: (v) => String(v),
});
