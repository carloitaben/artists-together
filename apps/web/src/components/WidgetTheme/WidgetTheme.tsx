import { Suspense } from "react"

import { Theme } from "~/lib/themes"

import WidgetThemeButton from "./WidgetThemeButton"

const bg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 448 448"
    className="shadow-card"
  >
    <path
      fill="currentColor"
      d="M178.75 19.25a64 64 0 0 1 90.5 0l159.5 159.5a64 64 0 0 1 0 90.5l-159.5 159.5a64 64 0 0 1-90.5 0l-159.5-159.5a64 64 0 0 1 0-90.5l159.5-159.5Z"
    />
  </svg>
)

function Content() {
  return (
    <div className="relative text-theme-50">
      {bg}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <WidgetThemeButton theme={Theme["anamorphic-teal"]} />
        <WidgetThemeButton theme={Theme["arpeggio-black"]} />
        <WidgetThemeButton theme={Theme["outsider-violet"]} />
        <WidgetThemeButton theme={Theme["tuxedo-crimson"]} />
      </div>
    </div>
  )
}

function Fallback() {
  return <div className="text-theme-700">{bg}</div>
}

export default function WidgetTheme() {
  return (
    <div className="col-span-2">
      <Suspense fallback={<Fallback />}>
        <Content />
      </Suspense>
    </div>
  )
}
