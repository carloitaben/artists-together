import { Form } from "@remix-run/react"
import { motion } from "framer-motion"
import { $path } from "remix-routes"
import type { Theme } from "~/lib/themes"
import { theme, useTheme } from "~/lib/themes"

const bg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 448 448"
    className="shadow-card"
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M178.75 19.25a64 64 0 0 1 90.5 0l159.5 159.5a64 64 0 0 1 0 90.5l-159.5 159.5a64 64 0 0 1-90.5 0l-159.5-159.5a64 64 0 0 1 0-90.5l159.5-159.5Z"
    />
  </svg>
)

const rotate = {
  [theme.enum["anamorphic-teal"]]: 0,
  [theme.enum["arpeggio-black"]]: 270,
  [theme.enum["tuxedo-crimson"]]: 180,
  [theme.enum["outsider-violet"]]: 90,
}

export function WidgetThemeSkeleton() {
  return (
    <div className="col-span-2">
      <div className="text-theme-700">{bg}</div>
    </div>
  )
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

export default function WidgetTheme() {
  const currentTheme = useTheme()

  return (
    <div className="col-span-2">
      <div className="relative text-theme-50">
        {bg}
        <Form
          className="pointer-events-none absolute inset-0 rotate-45"
          method="post"
          fetcherKey="theme"
          action={$path("/api/theme")}
          navigate={false}
        >
          <motion.div
            className="pointer-events-auto absolute grid grid-cols-2 grid-rows-2 overflow-hidden rounded-full inset-16"
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
      </div>
    </div>
  )
}
