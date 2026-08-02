import { useEffect, useState } from "react";
import { useLang } from "../i18n/useLang";

export function Clock({ datetime }: { datetime: string }) {
  const [now, setNow] = useState(() => new Date());
  const { t, n } = useLang();
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="font-mono text-xs text-muted">
      <span className="text-accent">●</span> {n(`${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`)} {t.footer.local}
      <span className="ml-3">{t.footer.computedAt} {n(new Date(datetime).toUTCString().slice(17, 25))} UTC</span>
    </div>
  );
}
