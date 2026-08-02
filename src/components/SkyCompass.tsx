import type { SkyOverview, SunPosition } from "../lib/types";
import { activeSkyBody, compassRadar, compassAbbr, humanUntil } from "../lib/sky";
import { useLang } from "../i18n/useLang";
import { inTime } from "../i18n/format";

const C = 150, R = 112, MR = 13;

function Rings({ rose }: { rose: { n: string; e: string; s: string; w: string; zenith: string } }) {
  return (
    <g>
      <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,.22)" />
      <circle cx={C} cy={C} r={R * 0.66} fill="none" stroke="rgba(255,255,255,.12)" />
      <circle cx={C} cy={C} r={R * 0.33} fill="none" stroke="rgba(255,255,255,.12)" />
      <circle cx={C} cy={C} r={2.5} fill="rgba(255,255,255,.5)" />
      <g fill="rgba(255,255,255,.6)" fontFamily="IBM Plex Mono" fontSize="11" textAnchor="middle">
        <text x={C} y={C - R - 8}>{rose.n}</text>
        <text x={C + R + 12} y={C + 4}>{rose.e}</text>
        <text x={C} y={C + R + 18}>{rose.s}</text>
        <text x={C - R - 12} y={C + 4}>{rose.w}</text>
      </g>
      <text x={C} y={C - 8} fill="rgba(255,255,255,.35)" fontFamily="IBM Plex Mono" fontSize="9" textAnchor="middle">{rose.zenith}</text>
    </g>
  );
}

function Spoke({ x, y, color }: { x: number; y: number; color: string }) {
  return <line x1={C} y1={C} x2={x} y2={y} stroke={color} strokeOpacity="0.5" />;
}

export function SkyCompass({ overview, sunPosition, now }: {
  overview: SkyOverview; sunPosition: SunPosition | null | undefined; now: Date;
}) {
  const active = activeSkyBody(overview, sunPosition, now);
  const { t, n, lang } = useLang();

  let chipIcon = "☀", chipName = t.compassPill.theSun, accent = "#ffd8a8", body: React.ReactNode = null;
  let readout = "";

  if (active.kind === "sun") {
    const { x, y } = compassRadar(C, C, R, active.altitude, active.azimuth);
    accent = "#ffd8a8";
    readout = `${n(Math.round(active.altitude))}° · ${compassAbbr(active.azimuth, lang)} · ${n(Math.round(active.azimuth))}°`;
    body = (
      <g>
        <Spoke x={x} y={y} color="#ff7a45" />
        <g transform={`translate(${x},${y})`}>
          <circle r="22" fill="#ffb057" opacity="0.35"><animate attributeName="opacity" values="0.2;0.45;0.2" dur="3.6s" repeatCount="indefinite" /></circle>
          <circle r={MR} fill="url(#compassSun)" />
          <text y={-MR - 8} textAnchor="middle" fill="#fff" fontFamily="Space Grotesk" fontWeight="700" fontSize="13">{n(Math.round(active.altitude))}°</text>
        </g>
      </g>
    );
  } else if (active.kind === "moon") {
    const { x, y } = compassRadar(C, C, R, active.altitude, active.azimuth);
    chipIcon = "☾"; chipName = t.compassPill.theMoon; accent = "#cdd7ee";
    readout = `${n(Math.round(active.altitude))}° · ${compassAbbr(active.azimuth, lang)} · ${n(Math.round(active.illumination * 100))}% ${t.compassPill.lit}`;
    const offset = active.illumination * 2 * MR; // terminator shift (see MoonGlyph)
    body = (
      <g>
        <Spoke x={x} y={y} color="#9fb2e0" />
        <g transform={`translate(${x},${y})`}>
          <circle r="20" fill="#aab6da" opacity="0.4"><animate attributeName="opacity" values="0.25;0.5;0.25" dur="4.2s" repeatCount="indefinite" /></circle>
          <circle r={MR} fill="#eef2fb" />
          <circle r={MR} cx={offset} fill="#0b1230" />
          <circle r={MR} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1" />
          <text y={-MR - 8} textAnchor="middle" fill="#fff" fontFamily="Space Grotesk" fontWeight="700" fontSize="12">{n(Math.round(active.illumination * 100))}%</text>
        </g>
      </g>
    );
  } else if (active.kind === "next") {
    // Both below the horizon → show the next body rising in the east.
    const { x, y } = compassRadar(C, C, R, 0, 90);
    chipIcon = active.body === "sun" ? "☀" : "☾";
    chipName = active.body === "sun" ? t.compassPill.theSun : t.compassPill.theMoon;
    accent = active.body === "sun" ? "#ffd8a8" : "#cdd7ee";
    const until = humanUntil(active.risesAt.iso, now, lang);
    readout = `${t.compassPill.rises} ${n(active.risesAt.time24)}${until ? ` · ${inTime(until, lang)}` : ""}`;
    body = (
      <g transform={`translate(${x},${y})`} opacity="0.85">
        <circle r="16" fill={accent} opacity="0.18"><animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.28;0.05;0.28" dur="3s" repeatCount="indefinite" /></circle>
        <circle r="6" fill={accent} />
      </g>
    );
  } else {
    chipIcon = "○"; chipName = t.compassPill.theSky; readout = t.compassPill.resting;
  }

  const chipVerb = active.kind === "next" ? t.compassPill.nextUp : t.compassPill.nowTracking;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/85 backdrop-blur-sm">
        <span style={{ color: accent }}>{chipIcon}</span> {chipVerb} <b className="font-bold">{chipName}</b>
      </div>
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" role="img" aria-label={`${t.compassPill.ariaPrefix} — ${chipName}, ${readout}`}>
        <defs>
          <radialGradient id="compassSun">
            <stop offset="0" stopColor="#fff2d8" /><stop offset="55%" stopColor="#ffb057" /><stop offset="100%" stopColor="#ff7a45" />
          </radialGradient>
        </defs>
        <Rings rose={t.rose} />
        {body}
      </svg>
      <div className="font-mono text-[11px] text-white/70">{readout}</div>
    </div>
  );
}
