import { Suspense, lazy } from "react"
import type { Location } from "~/routes/api.location"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import ClientOnly from "~/components/ClientOnly"

const WidgetClockContent = lazy(() => import("./WidgetClockContent"))

type Props = {
  location: Location | null
}

export default function WidgetClock({ location }: Props) {
  return (
    <div className="col-span-2 select-none">
      <AspectRatio.Root
        ratio={1}
        className="overflow-hidden rounded-full shadow-card"
      >
        <ClientOnly
          show={!!location}
          fallback={<div className="absolute inset-0 bg-theme-700" />}
        >
          <Suspense>
            <WidgetClockContent location={location!} />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
