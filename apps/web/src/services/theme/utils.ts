import { z } from "zod"
import { parseToRgba } from "color2k"
import { CSSProperties } from "react"
import { tailwind } from "~/lib/tailwind"

export const cookieName = "theme"

export const theme = z.enum([
  "anamorphic-teal",
  "arpeggio-black",
  "tuxedo-crimson",
  "outsider-violet",
])

export type Theme = z.infer<typeof theme>

export const defaultTheme = theme.enum["anamorphic-teal"]

export function getThemeStyle(theme: Theme) {
  return Object.fromEntries(
    Object.entries(tailwind.theme.colors[theme]).map(([k, v]) => {
      const [r, g, b] = parseToRgba(v)
      return [`--theme-${k}`, `${r},${g},${b}`]
    }),
  ) as CSSProperties
}
