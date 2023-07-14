import { Suspense } from "react"
import { cookies } from "next/headers"

import { getThemeCookie } from "~/lib/themes"

import WidgetThemeContent from "./WidgetThemeContent"

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

function Fallback() {
  return <div className="text-theme-700">{bg}</div>
}

export default function WidgetTheme() {
  const theme = getThemeCookie(cookies())

  return (
    <div className="col-span-2">
      <Suspense fallback={<Fallback />}>
        <div className="relative text-theme-50">
          {bg}
          <WidgetThemeContent theme={theme} />
        </div>
      </Suspense>
    </div>
  )
}
