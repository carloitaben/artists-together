"use client"

import {
  PanInfo,
  animate,
  motion,
  transform,
  useMotionValue,
} from "framer-motion"
import { useCallback, useRef, useState } from "react"

// import { useWebSocketEmitter, useWebSocketEvent } from "~/hooks/ws"

function getRelativePoint(point: { x: number; y: number }, rect: DOMRect) {
  const x = transform(point.x, [rect.x, rect.x + rect.width], [0, rect.width])
  const y = transform(point.y, [rect.y, rect.y + rect.height], [rect.height, 0])

  return {
    x,
    y,
  }
}

export default function WidgetSpinnerContent() {
  const ref = useRef<HTMLDivElement>(null)
  const rotate = useMotionValue(0)

  const [busy, setBusy] = useState(false)
  // const emit = useWebSocketEmitter("widget:spinner")

  // useWebSocketEvent("widget:spinner", (data) => {
  //   setBusy(data.busy)
  //   rotate.set(data.degs)
  // })

  const onPan = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const rectCenterX = rect.width / 2
      const rectCenterY = rect.height / 2

      const origin = {
        x: info.point.x - info.offset.x,
        y: info.point.y - info.offset.y,
      }

      const relativePoint = getRelativePoint(info.point, rect)
      const relativePointOrigin = getRelativePoint(origin, rect)

      const rads = Math.atan2(
        relativePoint.x - rectCenterX,
        relativePoint.y - rectCenterY
      )
      const originRads = Math.atan2(
        relativePointOrigin.x - rectCenterX,
        relativePointOrigin.y - rectCenterY
      )

      const degs = ((rads - originRads) * 180) / Math.PI
      // emit({ busy: true, degs })
      rotate.set(degs)
    },
    [rotate]
  )

  const onPanStart = useCallback(() => {
    // emit({ busy: true, degs: 0 })
  }, [])

  const onPanEnd = useCallback(() => {
    // emit({ busy: false, degs: 0 })
    animate(rotate, 0, {
      type: "spring",
      mass: 0.05,
    })
  }, [rotate])

  return (
    <motion.div
      ref={ref}
      onPan={onPan}
      onPanStart={onPanStart}
      onPanEnd={onPanEnd}
    >
      <motion.svg
        className="pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 219 219"
        fill="none"
        style={{ rotate }}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          className="fill-physical-orange-500"
          d="M109.5.977c-4.774 0-9.306 1.877-18.369 5.631L49.733 23.756c-9.063 3.754-13.594 5.631-16.97 9.007-3.376 3.376-5.253 7.907-9.007 16.97L6.61 91.131C2.854 100.194.977 104.726.977 109.5c0 4.774 1.877 9.305 5.632 18.369l17.147 41.397c3.754 9.064 5.631 13.595 9.007 16.971 3.376 3.376 7.907 5.253 16.97 9.007l41.398 17.147c9.063 3.754 13.595 5.631 18.369 5.631 4.774 0 9.306-1.877 18.369-5.631l41.397-17.147c9.064-3.754 13.595-5.631 16.971-9.007 3.376-3.376 5.253-7.907 9.007-16.971l17.147-41.397c3.755-9.063 5.632-13.595 5.632-18.369 0-4.774-1.877-9.306-5.632-18.369l-17.147-41.398c-3.754-9.063-5.631-13.594-9.007-16.97-3.376-3.376-7.907-5.253-16.971-9.007L127.869 6.608C118.806 2.854 114.274.978 109.5.978ZM110 46c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12s-12 5.372-12 12c0 6.627 5.373 12 12 12Z"
        />
        <path
          className="fill-physical-orange-700"
          fill="currentColor"
          d="M93 110.133c0 2 .378 3.945 1.133 5.834.756 1.889 1.934 3.633 3.534 5.233l.666.667V118c0-.755.256-1.389.767-1.9.511-.511 1.144-.767 1.9-.767s1.389.256 1.9.767c.511.511.767 1.145.767 1.9v10.667c0 .755-.256 1.389-.767 1.9-.511.511-1.144.766-1.9.766H90.333c-.755 0-1.389-.255-1.9-.766-.51-.511-.766-1.145-.766-1.9 0-.756.255-1.389.766-1.9.511-.511 1.145-.767 1.9-.767H95l-1.067-.933c-2.31-2.045-3.933-4.378-4.866-7-.934-2.622-1.4-5.267-1.4-7.934 0-4.177 1.066-7.966 3.2-11.366 2.133-3.4 5-6.011 8.6-7.834.622-.355 1.277-.377 1.966-.066.689.31 1.145.822 1.367 1.533a2.95 2.95 0 0 1-.033 2 2.848 2.848 0 0 1-1.3 1.533 16.375 16.375 0 0 0-6.167 5.9c-1.533 2.512-2.3 5.278-2.3 8.3Zm32-.266c0-2-.378-3.945-1.133-5.834-.756-1.888-1.934-3.633-3.534-5.233l-.666-.667V102c0 .756-.256 1.389-.767 1.9-.511.511-1.144.767-1.9.767s-1.389-.256-1.9-.767c-.511-.511-.767-1.144-.767-1.9V91.333c0-.755.256-1.388.767-1.9.511-.51 1.144-.766 1.9-.766h10.667c.755 0 1.389.255 1.9.766.511.511.766 1.145.766 1.9 0 .756-.255 1.39-.766 1.9-.511.511-1.145.767-1.9.767H123l1.067.933c2.177 2.178 3.766 4.545 4.766 7.1 1 2.556 1.5 5.167 1.5 7.834 0 4.178-1.066 7.966-3.2 11.366-2.133 3.4-5 6.012-8.6 7.834-.622.355-1.277.378-1.966.066-.689-.311-1.145-.822-1.367-1.533a2.95 2.95 0 0 1 .033-2 2.844 2.844 0 0 1 1.3-1.533 16.37 16.37 0 0 0 6.167-5.9c1.533-2.511 2.3-5.278 2.3-8.3Z"
        />
      </motion.svg>
    </motion.div>
  )
}
