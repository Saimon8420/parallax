import type { BodyKey } from "../lib/types";

export function BodyMark({
  bodyKey, x, y, label, accent, onSelect,
}: {
  bodyKey: BodyKey; x: number; y: number; label: string; accent?: boolean;
  onSelect: (k: BodyKey) => void;
}) {
  const r = bodyKey === "sun" ? 6 : 3.4;
  return (
    <g data-body={bodyKey} className="cursor-pointer" onClick={() => onSelect(bodyKey)}>
      <circle cx={x} cy={y} r={r} className={accent ? "fill-accent" : "fill-ink"} />
      <text x={x + 7} y={y + 3} className="fill-muted font-mono" fontSize="9">{label}</text>
    </g>
  );
}
