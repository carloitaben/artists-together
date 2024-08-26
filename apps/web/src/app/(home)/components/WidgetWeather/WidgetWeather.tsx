import { lazy, Suspense } from "react"
import { getRandomLocationWithWeather } from "~/services/locations/server"
import AspectRatio from "~/components/AspectRatio"

const WidgetWeatherContent = lazy(() => import("./WidgetWeatherContent"))

export default function WidgetWeather() {
  const location = getRandomLocationWithWeather()

  return (
    <div className="col-span-4 sm:col-span-3 sm:col-start-3">
      <AspectRatio.Root
        ratio={680 / 298}
        className="select-none overflow-hidden bg-arpeggio-black-800 shadow-card scale:rounded-l-16 scale:rounded-r-[9.375rem]"
      >
        <AspectRatio.Content>
          <Suspense>
            <WidgetWeatherContent promise={location} />
          </Suspense>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </div>
  )
}
