import { Form } from "@remix-run/react"
import { motion } from "framer-motion"
import { $path } from "remix-routes"
import type { Theme } from "~/lib/themes"
import { theme, useTheme } from "~/lib/themes"
import WidgetThemeBg from "./WidgetThemeBg"

const rotate = {
  [theme.enum["anamorphic-teal"]]: 0,
  [theme.enum["arpeggio-black"]]: 270,
  [theme.enum["tuxedo-crimson"]]: 180,
  [theme.enum["outsider-violet"]]: 90,
}

function WidgetThemeButton({
  className,
  theme,
}: {
  className: string
  theme: Theme
}) {
  const currentTheme = useTheme()
  const name = theme.split("-")

  return (
    <button
      name="theme"
      value={theme}
      role="radio"
      aria-checked={currentTheme === theme}
      aria-label={`Switch to the ${name} theme`}
      className={className}
    />
  )
}

export default function WidgetThemeContent() {
  const currentTheme = useTheme()

  return (
    <div className="col-span-2">
      <div className="relative text-theme-50">
        <WidgetThemeBg />
        <Form
          className="pointer-events-none absolute inset-0 rotate-45"
          method="post"
          fetcherKey="theme"
          action={$path("/api/theme")}
          navigate={false}
        >
          <motion.div
            className="pointer-events-auto absolute grid grid-cols-2 grid-rows-2 overflow-hidden rounded-full fluid:inset-16"
            initial={false}
            animate={{ rotate: rotate[currentTheme] }}
          >
            <WidgetThemeButton
              className="bg-anamorphic-teal-100 aria-checked:bg-anamorphic-teal-300"
              theme={theme.enum["anamorphic-teal"]}
            />
            <WidgetThemeButton
              className="bg-arpeggio-black-100 aria-checked:bg-arpeggio-black-300"
              theme={theme.enum["arpeggio-black"]}
            />
            <WidgetThemeButton
              className="bg-outsider-violet-100 aria-checked:bg-outsider-violet-300"
              theme={theme.enum["outsider-violet"]}
            />
            <WidgetThemeButton
              className="bg-tuxedo-crimson-100 aria-checked:bg-tuxedo-crimson-300"
              theme={theme.enum["tuxedo-crimson"]}
            />
          </motion.div>
          <div className="absolute flex items-center justify-center overflow-hidden rounded-full fluid:inset-16">
            <div className="absolute left-0 top-[50%] bg-theme-50 shadow-button fluid:-mt-2 fluid:h-4 fluid:w-40" />
            <div className="absolute left-[50%] top-0 bg-theme-50 shadow-button fluid:-ml-2 fluid:h-40 fluid:w-4" />
            <div className="relative rounded-full bg-theme-50 shadow-button fluid:h-28 fluid:w-28" />
          </div>
        </Form>
      </div>
    </div>
  )
}
