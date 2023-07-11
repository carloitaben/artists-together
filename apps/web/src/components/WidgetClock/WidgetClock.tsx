"use client"

import { lazy, Suspense, useEffect, useState } from "react"

const WidgetClockContent = lazy(() => import("./WidgetClockContent"))

function Fallback() {
  return <div className="absolute inset-0 bg-theme-700" />
}

export default function WidgetClock() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div className="col-span-2">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        {/* <Suspense fallback={<Fallback />}> */}
        {hydrated ? <WidgetClockContent /> : null}
        {/* </Suspense> */}
      </article>
    </div>
  )
}
