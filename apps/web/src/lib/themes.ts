import type { CSSProperties } from "react"
import { parseToRgba } from "color2k"

import { tailwind } from "./tailwind"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export const cookie = "theme"

export const theme = {
  "anamorphic-teal": "0",
  "arpeggio-black": "1",
  "outsider-violet": "2",
  "tuxedo-crimson": "3",
} as const

export type Theme = (typeof theme)[keyof typeof theme]

function makeTheme(color: keyof (typeof tailwind)["theme"]["colors"]) {
  return Object.fromEntries(
    Object.entries(tailwind.theme.colors[color]).map(([k, v]) => {
      const [r, g, b] = parseToRgba(v)
      return [k, `${r},${g},${b}`]
    })
  )
}

const themeVariables = {
  [theme["anamorphic-teal"]]: makeTheme("anamorphic-teal"),
  [theme["arpeggio-black"]]: makeTheme("arpeggio-black"),
  [theme["outsider-violet"]]: makeTheme("outsider-violet"),
  [theme["tuxedo-crimson"]]: makeTheme("tuxedo-crimson"),
}

export function getThemeCookie(cookies: ReadonlyRequestCookies) {
  return (cookies.get(cookie)?.value as Theme) || theme["anamorphic-teal"]
}

export function getThemeCSS(theme: Theme) {
  return Object.fromEntries(
    Object.entries(themeVariables[theme]).map(([k, v]) => [`--theme-${k}`, v])
  ) as CSSProperties
}
