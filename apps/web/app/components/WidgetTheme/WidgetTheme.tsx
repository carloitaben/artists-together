import { Suspense, lazy } from "react"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import ClientOnly from "~/components/ClientOnly"
import WidgetThemeBg from "./WidgetThemeBg"

const WidgetThemeContent = lazy(() => import("./WidgetThemeContent"))

export default function WidgetTheme() {
  return (
    <div className="col-span-2 text-theme-700">
      <AspectRatio.Root ratio={1}>
        <ClientOnly fallback={<WidgetThemeBg />}>
          <Suspense>
            <WidgetThemeContent />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
