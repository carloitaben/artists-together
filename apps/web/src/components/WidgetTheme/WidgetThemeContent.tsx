"use client"

import { useCallback, useState, useTransition } from "react"
import { motion } from "framer-motion"

import { getThemeStyle, theme, Theme } from "~/services/theme/utils"
import { changeTheme } from "~/actions/theme"

function WidgetThemeButton({
  change,
  className,
  selected,
  theme,
}: {
  change: (theme: Theme) => void
  className: string
  selected: Theme
  theme: Theme
}) {
  return (
    <button
      role="radio"
      aria-label={`Switch to theme ${theme}`}
      aria-checked={selected === theme}
      className={className}
      onClick={() => change(theme)}
    />
  )
}

const rotate = {
  [theme.enum["anamorphic-teal"]]: 0,
  [theme.enum["arpeggio-black"]]: 270,
  [theme.enum["tuxedo-crimson"]]: 180,
  [theme.enum["outsider-violet"]]: 90,
}

function Overlay() {
  return (
    <div className="absolute flex items-center justify-center overflow-hidden rounded-full fluid:inset-16">
      <div className="absolute left-0 top-[50%] bg-theme-50 shadow-button fluid:-mt-2 fluid:h-4 fluid:w-40" />
      <div className="absolute left-[50%] top-0 bg-theme-50 shadow-button fluid:-ml-2 fluid:h-40 fluid:w-4" />
      <div className="relative rounded-full bg-theme-50 shadow-button fluid:h-28 fluid:w-28" />
    </div>
  )
}

export default function WidgetThemeContent({
  selectedTheme,
}: {
  selectedTheme: Theme
}) {
  const [selected, setSelected] = useState(selectedTheme)
  const [_, startTransition] = useTransition()

  const change = useCallback((theme: Theme) => {
    setSelected(theme)

    const themeStyle = getThemeStyle(theme)
    Object.entries(themeStyle).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v)
    })

    startTransition(async () => void changeTheme(theme))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 rotate-45">
      <motion.div
        className="pointer-events-auto absolute grid grid-cols-2 grid-rows-2 overflow-hidden rounded-full fluid:inset-16"
        initial={false}
        animate={{ rotate: rotate[selected] }}
      >
        <WidgetThemeButton
          className="bg-anamorphic-teal-100 aria-checked:bg-anamorphic-teal-300"
          selected={selected}
          change={change}
          theme={theme.enum["anamorphic-teal"]}
        />
        <WidgetThemeButton
          className="bg-arpeggio-black-100 aria-checked:bg-arpeggio-black-300"
          selected={selected}
          change={change}
          theme={theme.enum["arpeggio-black"]}
        />
        <WidgetThemeButton
          className="bg-outsider-violet-100 aria-checked:bg-outsider-violet-300"
          selected={selected}
          change={change}
          theme={theme.enum["outsider-violet"]}
        />
        <WidgetThemeButton
          className="bg-tuxedo-crimson-100 aria-checked:bg-tuxedo-crimson-300"
          selected={selected}
          change={change}
          theme={theme.enum["tuxedo-crimson"]}
        />
      </motion.div>
      <Overlay />
    </div>
  )
}
