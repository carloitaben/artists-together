import { Suspense } from "react"
import { getRandomLocationWithWeather } from "~/services/locations/server"
import AspectRatio from "~/components/AspectRatio"
import ClientOnly from "~/components/ClientOnly"
import WidgetWeatherContent from "./WidgetWeatherContent"

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
            <ClientOnly>
              <WidgetWeatherContent promise={location} />
            </ClientOnly>
          </Suspense>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </div>
  )
}
