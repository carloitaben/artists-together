"use client"

import { Suspense, lazy, useEffect } from "react"
import { useReducedMotion, useScroll } from "motion/react"
import { onMeasure, useScreen } from "~/lib/media"
import { measure, measurements, SCOPE_ROOT } from "./lib"
import Me from "./Me"

const CursorPresenceRoom = lazy(() => import("./CursorPresenceRoom"))

export default function Cursors() {
  const sm = useScreen("sm")
  const scroll = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const renderOtherCursors = sm && !shouldReduceMotion

  useEffect(() => {
    if (!renderOtherCursors) return

    const clearX = scroll.scrollX.on("change", (x) => {
      const rect = measure(SCOPE_ROOT, document.documentElement)
      rect.x = -x
      measurements.clear()
      measurements.set(SCOPE_ROOT, rect)
    })

    const clearY = scroll.scrollY.on("change", (y) => {
      const rect = measure(SCOPE_ROOT, document.documentElement)
      rect.y = -y
      measurements.clear()
      measurements.set(SCOPE_ROOT, rect)
    })

    const clearMeasure = onMeasure(document.documentElement, (entry) => {
      const rect = DOMRect.fromRect(entry)
      rect.x = -scroll.scrollX.get()
      rect.y = -scroll.scrollY.get()
      measurements.set(SCOPE_ROOT, DOMRect.fromRect(entry))
    })

    return () => {
      clearX()
      clearY()
      clearMeasure()
    }
  }, [renderOtherCursors, scroll.scrollX, scroll.scrollY, sm])

  if (shouldReduceMotion) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 isolate z-50 size-full select-none overflow-hidden"
    >
      {sm ? (
        <Suspense>
          <CursorPresenceRoom />
        </Suspense>
      ) : null}
      <Me />
    </div>
  )
}
