import { Suspense, lazy } from "react"
import ClientOnly from "~/components/ClientOnly"
import WidgetThemeBg from "./WidgetThemeBg"

const WidgetThemeContent = lazy(() => import("./WidgetThemeContent"))

export default function WidgetTheme() {
  return (
    <div className="col-span-2 text-theme-700">
      <ClientOnly fallback={<WidgetThemeBg />}>
        <Suspense>
          <WidgetThemeContent />
        </Suspense>
      </ClientOnly>
    </div>
  )
}
