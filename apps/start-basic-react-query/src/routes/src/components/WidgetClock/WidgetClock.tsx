import { lazy, Suspense } from "react"
import { getRandomLocationWithWeather } from "~/services/locations/server"
import AspectRatio from "~/components/AspectRatio"

const WidgetClockContent = lazy(() => import("./WidgetClockContent"))

export default function WidgetClock() {
  const location = getRandomLocationWithWeather()

  return (
    <div className="col-span-2">
      <AspectRatio.Root
        ratio={1}
        className="select-none overflow-hidden rounded-full bg-arpeggio-black-800 shadow-card"
      >
        <AspectRatio.Content>
          <Suspense>
            <WidgetClockContent promise={location} />
          </Suspense>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </div>
  )
}
