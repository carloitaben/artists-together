import { Suspense, lazy } from "react"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import ClientOnly from "~/components/ClientOnly"

const WidgetRecorderContent = lazy(() => import("./WidgetRecorderContent"))

export default function WidgetRecorder() {
  return (
    <div className="col-span-1 select-none">
      <AspectRatio.Root
        ratio={216 / 448}
        className="overflow-hidden fluid:rounded-5xl shadow-card"
      >
        <ClientOnly
          fallback={<div className="absolute inset-0 bg-theme-700" />}
        >
          <Suspense>
            <WidgetRecorderContent />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
