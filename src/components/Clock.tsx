import { useEffect, useState } from "react";

export function Clock({ datetime }: { datetime: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="font-mono text-xs text-muted">
      <span className="text-accent">●</span> {p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())} local
      <span className="ml-3">computed at {new Date(datetime).toUTCString().slice(17, 25)} UTC</span>
    </div>
  );
}
