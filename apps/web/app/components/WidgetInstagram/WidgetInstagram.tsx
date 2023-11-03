import { Suspense, lazy } from "react"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import ClientOnly from "~/components/ClientOnly"

const WidgetInstagramContent = lazy(() => import("./WidgetInstagramContent"))

export default function WidgetInstagram() {
  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <AspectRatio.Root
        ratio={1}
        className="overflow-hidden fluid:rounded-3xl shadow-card"
      >
        <ClientOnly fallback={<div className="w-full h-full bg-theme-700" />}>
          <Suspense>
            <WidgetInstagramContent />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
