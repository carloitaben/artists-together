import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import { Suspense, lazy } from "react"
import type { Location } from "~/routes/api.location"
import ClientOnly from "~/components/ClientOnly"

const WidgetWeatherContent = lazy(() => import("./WidgetWeatherContent"))

type Props = {
  location: Location | null
}

export default function WidgetWeather({ location }: Props) {
  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <AspectRatio.Root
        ratio={680 / 298}
        className="overflow-hidden shadow-card rounded-l-5xl rounded-r-[9.375rem]"
      >
        <ClientOnly
          show={!!location}
          fallback={<div className="w-full h-full bg-theme-700" />}
        >
          <Suspense>
            <WidgetWeatherContent location={location!} />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
