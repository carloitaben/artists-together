import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { ComponentRef, CSSProperties, ForwardedRef } from "react"
import { forwardRef } from "react"
import { colors } from "~/../tailwind.config"

type Theme = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

type Colors = typeof colors

type ThemeableColor = keyof {
  [K in keyof Colors as K extends "theme"
    ? never
    : Colors[K] extends Theme
      ? K
      : never]: Colors[K]
}

type Props = HTMLArkProps<"div"> & {
  theme: ThemeableColor | Theme
}

const regex = /(?:rgb\()(\d+,)\s*(\d+,)\s*(\d+)(?:\))/

function makeThemeVariables(theme: Props["theme"]) {
  const resolvedTheme = typeof theme === "string" ? colors[theme] : theme

  return Object.fromEntries(
    Object.entries(resolvedTheme).map(([key, value]) => [
      `--theme-${key}`,
      value.replace(regex, "$1 $2 $3"),
    ]),
  ) as CSSProperties
}

function Theme(
  { theme, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  return <ark.div {...props} ref={ref} style={makeThemeVariables(theme)} />
}

export default forwardRef(Theme)
