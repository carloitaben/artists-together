import type { CSSProperties } from "react"
import { useFetchers } from "@remix-run/react"
import { parseToRgba } from "color2k"
import { z } from "zod"
import { useRootLoaderData } from "~/hooks/loaders"
import { tailwind } from "./tailwind"

export const theme = z.enum([
  "anamorphic-teal",
  "arpeggio-black",
  "outsider-violet",
  "tuxedo-crimson",
])

export type Theme = z.infer<typeof theme>

export const defaultTheme = theme.enum["anamorphic-teal"]

function getThemeStyle(theme: Theme) {
  return Object.fromEntries(
    Object.entries(tailwind.theme.colors[theme]).map(([k, v]) => {
      const [r, g, b] = parseToRgba(v)
      return [`--theme-${k}`, `${r},${g},${b}`]
    })
  ) as CSSProperties
}

export function useTheme() {
  const data = useRootLoaderData()
  const fetchers = useFetchers()

  const fetcher = fetchers.find((fetcher) => fetcher.key === "theme")
  const submission = theme.safeParse(fetcher?.formData?.get("theme"))

  return submission.success ? submission.data : data?.theme
}

export function useThemeStyle() {
  const theme = useTheme()
  return getThemeStyle(theme)
}
