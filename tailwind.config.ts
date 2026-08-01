import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Horizon Line" palette — deep night ground, a warm sun accent, a cool moon.
        ground: "#05070f", ink: "#eef1f7", muted: "#9aa3b6", faint: "#6b7488",
        accent: "#ff7a45", moon: "#cdd7ee", rule: "#1b2233", orbit: "#2a3346",
        card: "#0c1322",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
