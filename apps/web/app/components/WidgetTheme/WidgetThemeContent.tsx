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
    <div className="text-theme-50">
      <WidgetThemeBg />
      <div className="absolute fluid:inset-16 pointer-events-none rounded-full overflow-hidden rotate-45">
        <Form
          className="w-full h-full"
          method="post"
          fetcherKey="theme"
          action={$path("/api/theme")}
          navigate={false}
        >
          <motion.div
            className="pointer-events-auto w-full h-full grid grid-cols-2 grid-rows-2 rounded-full overflow-hidden"
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
        </Form>
        <div className="absolute flex items-center justify-center inset-0">
          <div className="pointer-events-auto absolute left-0 top-[50%] bg-theme-50 shadow-button fluid:-mt-2 fluid:h-4 fluid:w-40" />
          <div className="pointer-events-auto absolute left-[50%] top-0 bg-theme-50 shadow-button fluid:-ml-2 fluid:h-40 fluid:w-4" />
          <div className="pointer-events-auto relative rounded-full bg-theme-50 shadow-button fluid:h-28 fluid:w-28" />
        </div>
      </div>
    </div>
  )
}
