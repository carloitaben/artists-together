import { Suspense, lazy, useEffect } from "react"
import { useScroll } from "motion/react"
import { useWebSocket } from "~/lib/websocket"
import { onMeasure, useScreen } from "~/lib/media"
import { measure, measurements, SCOPE_ROOT } from "./lib"
import Me from "./Me"

const CursorPresenceRoom = lazy(() => import("./CursorPresenceRoom"))

export default function Cursors() {
  const sm = useScreen("sm")
  const ws = useWebSocket()
  const scroll = useScroll()

  const render = Boolean(sm && ws)

  useEffect(() => {
    if (!render) return

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
  }, [render, scroll.scrollX, scroll.scrollY])

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 isolate size-full select-none overflow-hidden"
      >
        {render ? (
          <Suspense>
            <CursorPresenceRoom />
          </Suspense>
        ) : null}
      </div>
      <Me />
    </>
  )
}
