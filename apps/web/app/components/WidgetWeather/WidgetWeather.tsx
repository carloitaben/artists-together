import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import { Suspense, lazy } from "react"
import { $path } from "remix-routes"
import type { Location } from "~/routes/api.location"
import { useQuery } from "~/hooks/query"
import type { loader } from "~/routes/api.weather"
import ClientOnly from "~/components/ClientOnly"

const WidgetWeatherContent = lazy(() => import("./WidgetWeatherContent"))

type Props = {
  location: Location | null
}

export default function WidgetWeather({ location }: Props) {
  const { data = null } = useQuery<typeof loader>({
    load: !!location,
    route: $path("/api/weather", {
      latitude: location?.latitude || "",
      longitude: location?.longitude || "",
    }),
  })

  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <AspectRatio.Root
        ratio={680 / 298}
        className="overflow-hidden shadow-card fluid:rounded-l-5xl fluid:rounded-r-[9.375rem]"
      >
        <ClientOnly
          show={!!data && !!location}
          fallback={<div className="w-full h-full bg-theme-700" />}
        >
          <Suspense>
            <WidgetWeatherContent location={location!} weather={data!} />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
