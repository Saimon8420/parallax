export function MoonGlyph({ fraction, phaseName }: { fraction: number; phaseName: string }) {
  // Simple terminator: overlay a shifted disk to reveal `fraction` of the lit face.
  const offset = (1 - fraction) * 20; // px within a 40px disk
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10">
        <circle cx="20" cy="20" r="18" className="fill-ink" />
        <circle cx={20 + offset} cy="20" r="18" className="fill-ground" />
        <circle cx="20" cy="20" r="18" className="fill-none stroke-rule" strokeWidth="1" />
      </svg>
      <div className="font-mono text-sm">
        <div className="text-ink">{phaseName}</div>
        <div className="text-muted">{Math.round(fraction * 100)}% lit</div>
      </div>
    </div>
  );
}
