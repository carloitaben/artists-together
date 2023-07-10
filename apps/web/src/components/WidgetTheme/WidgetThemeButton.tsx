"use client"

import { swapTheme } from "~/lib/actions"
import { Theme } from "~/lib/themes"

type Props = {
  theme: Theme
}

export default function WidgetThemeButton({ theme }: Props) {
  return (
    <button
      className="bg-theme-100"
      onClick={async () => await swapTheme(theme)}
    >
      {theme}
    </button>
  )
}
