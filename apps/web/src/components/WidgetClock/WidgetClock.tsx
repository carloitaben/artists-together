import { lazy, Suspense } from "react"

const WidgetClockContent = lazy(() => import("./WidgetClockContent"))

function Fallback() {
  return <div className="absolute inset-0 bg-theme-700" />
}

export default function WidgetClock() {
  return (
    <div className="col-span-2">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <Suspense fallback={<Fallback />}>
          <WidgetClockContent />
        </Suspense>
      </article>
    </div>
  )
}
