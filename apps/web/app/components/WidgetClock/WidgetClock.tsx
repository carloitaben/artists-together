import { Suspense, lazy } from "react"
import type { Location } from "~/services/geo.server"
import ClientOnly from "~/components/ClientOnly"

const WidgetClockContent = lazy(() => import("./WidgetClockContent"))

type Props = {
  location: Location
}

export default function WidgetClock({ location }: Props) {
  return (
    <div className="col-span-2 select-none">
      <div className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <ClientOnly
          fallback={<div className="absolute inset-0 bg-theme-700" />}
        >
          <Suspense>
            <WidgetClockContent location={location} />
          </Suspense>
        </ClientOnly>
      </div>
    </div>
  )
}
