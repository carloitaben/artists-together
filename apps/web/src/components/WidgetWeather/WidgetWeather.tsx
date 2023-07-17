import { Suspense } from "react"

import WidgetWeatherContent from "./WidgetWeatherContent"

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetWeather() {
  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <div className="relative overflow-hidden rounded-l-5xl rounded-r-[9.375rem] pb-[43.6764705882%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <WidgetWeatherContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
