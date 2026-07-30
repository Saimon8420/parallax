import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#0c0c0c", ink: "#f4f4f2", muted: "#8f8f8f",
        accent: "#e0532f", rule: "#262626", orbit: "#3a3a3a",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
