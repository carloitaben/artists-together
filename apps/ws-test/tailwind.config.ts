import type { Config } from "tailwindcss"
import type { ScreensConfig } from "tailwindcss/types/config"
import noscriptPlugin from "tailwindcss-noscript"

export const screens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} satisfies ScreensConfig

export type Screens = typeof screens

export type Screen = keyof Screens

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    screens,
  },
  plugins: [noscriptPlugin],
} satisfies Config
