import { Suspense } from "react"
import { getRandomLocationWithWeather } from "~/services/locations/server"
import AspectRatio from "~/components/AspectRatio"
import ClientOnly from "~/components/ClientOnly"
import WidgetClockContent from "./WidgetClockContent"

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
            <ClientOnly>
              <WidgetClockContent promise={location} />
            </ClientOnly>
          </Suspense>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </div>
  )
}
