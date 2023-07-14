"use client"

import { useCallback, useState, useTransition } from "react"
import { motion } from "framer-motion"

import { swapTheme } from "~/lib/actions"
import { Theme } from "~/lib/themes"

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
  [Theme["anamorphic-teal"]]: 0,
  [Theme["arpeggio-black"]]: 90,
  [Theme["tuxedo-crimson"]]: 180,
  [Theme["outsider-violet"]]: 270,
}

export default function WidgetThemeContent({ theme }: { theme: Theme }) {
  const [selected, setSelected] = useState(theme)
  const [_, startTransition] = useTransition()

  const change = useCallback((theme: Theme) => {
    setSelected(theme)
    startTransition(async () => {
      await swapTheme(theme)
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 rotate-45">
      <div className="pointer-events-auto absolute grid grid-cols-2 grid-rows-2 overflow-hidden rounded-full fluid:inset-16">
        <WidgetThemeButton
          className="bg-anamorphic-teal-100 aria-checked:bg-anamorphic-teal-300"
          selected={selected}
          change={change}
          theme={Theme["anamorphic-teal"]}
        />
        <WidgetThemeButton
          className="bg-arpeggio-black-100 aria-checked:bg-arpeggio-black-300"
          selected={selected}
          change={change}
          theme={Theme["arpeggio-black"]}
        />
        <WidgetThemeButton
          className="bg-outsider-violet-100 aria-checked:bg-outsider-violet-300"
          selected={selected}
          change={change}
          theme={Theme["outsider-violet"]}
        />
        <WidgetThemeButton
          className="bg-tuxedo-crimson-100 aria-checked:bg-tuxedo-crimson-300"
          selected={selected}
          change={change}
          theme={Theme["tuxedo-crimson"]}
        />
      </div>
      <motion.div
        aria-hidden
        className="absolute flex items-center justify-center overflow-hidden rounded-full fluid:inset-16"
        initial={false}
        animate={{ rotate: rotate[selected] }}
      >
        <div className="absolute left-0 top-[50%] bg-theme-50 shadow-button fluid:-mt-2 fluid:h-4 fluid:w-40" />
        <div className="absolute left-[50%] top-0 bg-theme-50 shadow-button fluid:-ml-2 fluid:h-40 fluid:w-4" />
        <div className="relative rounded-full bg-theme-50 shadow-button fluid:h-28 fluid:w-28" />
      </motion.div>
    </div>
  )
}
