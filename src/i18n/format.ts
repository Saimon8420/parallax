import type { Lang } from "./types";
import { localizeDigits } from "./localizeDigits";

/** "in 44m" (en) / "৪৪ মিনিট পর" (bn). `until` is already lang-formatted. */
export function inTime(until: string, lang: Lang): string {
  return lang === "bn" ? `${until} পর` : `in ${until}`;
}

/** "13h 13m" → "১৩ ঘ ১৩ মি" in bn; unchanged in en. */
export function localizeDayLength(formatted: string, lang: Lang): string {
  if (lang !== "bn") return formatted;
  const m = formatted.match(/(\d+)h\s*(\d+)m/);
  if (m) return `${localizeDigits(m[1]!, lang)} ঘ ${localizeDigits(m[2]!, lang)} মি`;
  return localizeDigits(formatted, lang);
}
