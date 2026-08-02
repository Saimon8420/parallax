import { useContext } from "react";
import { LanguageContext } from "./context";

export function useLang() {
  return useContext(LanguageContext);
}
