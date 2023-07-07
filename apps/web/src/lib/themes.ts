import type { CSSProperties } from "react"
import { parseToRgba } from "color2k"

import { tailwind } from "./tailwind"

export const enum Theme {
  "anamorphic-teal",
  "arpeggio-black",
  "outsider-violet",
  "tuxedo-crimson",
}

function makeTheme(color: keyof (typeof tailwind)["theme"]["colors"]) {
  return Object.fromEntries(
    Object.entries(tailwind.theme.colors[color]).map(([k, v]) => {
      const [r, g, b] = parseToRgba(v)
      return [k, `${r},${g},${b}`]
    })
  )
}

export function makeThemeStyle(theme: ReturnType<typeof makeTheme>) {
  return Object.fromEntries(
    Object.entries(theme).map(([k, v]) => [`--theme-${k}`, v])
  ) as CSSProperties
}

const themes = {
  [Theme["anamorphic-teal"]]: makeTheme("anamorphic-teal"),
  [Theme["arpeggio-black"]]: makeTheme("arpeggio-black"),
  [Theme["outsider-violet"]]: makeTheme("outsider-violet"),
  [Theme["tuxedo-crimson"]]: makeTheme("tuxedo-crimson"),
}

export function getTheme(theme: Theme) {
  return themes[theme]
}
