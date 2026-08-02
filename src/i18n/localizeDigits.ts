import type { Lang } from "./types";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

/** Map ASCII digits to Bengali numerals in `bn`; identity otherwise. */
export function localizeDigits(input: string | number, lang: Lang): string {
  const s = String(input);
  if (lang !== "bn") return s;
  return s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]!);
}
