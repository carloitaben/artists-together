import { Suspense, lazy } from "react"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import ClientOnly from "~/components/ClientOnly"

const WidgetCalendarContent = lazy(() => import("./WidgetCalendarContent"))

export default function WidgetCalendar() {
  return (
    <div className="col-span-2 select-none">
      <AspectRatio.Root
        ratio={1}
        className="overflow-hidden fluid:rounded-5xl shadow-card"
      >
        <ClientOnly fallback={<div className="w-full h-full bg-theme-700" />}>
          <Suspense>
            <WidgetCalendarContent />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
