"use client"
import type { CursorState } from "@artists-together/core/ws"
import {
  AnimatePresence,
  useMotionValue,
  useSpring,
  clamp,
} from "framer-motion"
import { throttle } from "radashi"
import { useEffect, useState } from "react"
import { useScreen } from "~/hooks/media"
import { useUser } from "~/hooks/loaders"
import { useWebSocketDispatch, useWebSocketPayload } from "~/hooks/ws"
import { useMeasure } from "./lib"
import {
  ATTR_NAME_DATA_CURSOR_PRECISION,
  ATTR_NAME_DATA_CURSOR_PRECISION_SELECTOR,
} from "./CursorPrecision"
import Cursor from "./Cursor"

const limit = clamp.bind(null, 0, 1)

export default function Me() {
  const [state, setState] = useState<CursorState>()
  const dispatch = useWebSocketDispatch()
  const measure = useMeasure()
  const room = useWebSocketPayload("room:update", { count: 0, members: [] })
  const user = useUser()
  const sm = useScreen("sm")
  const hasCursor = useScreen("cursor")

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useSpring(0, { mass: 0.05, stiffness: 200 })

  const alone = room.count < 2

  useEffect(() => {
    if (!hasCursor) {
      return document.documentElement.classList.remove("cursor")
    }

    document.documentElement.classList.add("cursor")

    const notify = throttle(
      { interval: alone ? 5_000 : 80 },
      (event: MouseEvent, state?: CursorState) => {
        if (!user || !sm) return

        if (!state) {
          return dispatch("cursor:update", null)
        }

        const target =
          event.target &&
          event.target instanceof Element &&
          event.target.closest(ATTR_NAME_DATA_CURSOR_PRECISION_SELECTOR)

        if (!target) return

        const targetAttribute = target.getAttribute(
          ATTR_NAME_DATA_CURSOR_PRECISION,
        )

        if (!targetAttribute) {
          throw Error(
            `Missing attribute "${ATTR_NAME_DATA_CURSOR_PRECISION}" on target`,
          )
        }

        const rect = measure(targetAttribute, () => target)
        const percentX = limit((event.clientX - rect.x) / rect.width)
        const percentY = limit((event.clientY - rect.y) / rect.height)

        dispatch("cursor:update", {
          x: percentX,
          y: percentY,
          target: targetAttribute,
          state,
        })
      },
    )

    function onMouseEnter(event: MouseEvent) {
      x.jump(event.clientX)
      y.jump(event.clientY)
      setState("idle")
      notify(event, "idle")
    }

    function onMouseLeave(event: MouseEvent) {
      setState(undefined)
      notify(event)
    }

    function onMouseMove(event: MouseEvent) {
      if (!state) {
        x.jump(event.clientX)
        y.jump(event.clientY)
        setState("idle")
        return notify(event, "idle")
      }

      x.set(event.clientX)
      y.set(event.clientY)
      notify(event, state)
    }

    function onMouseDown(event: MouseEvent) {
      scale.set(0.9)
      notify(event, state)
    }

    function onMouseUp(event: MouseEvent) {
      scale.set(1)
      notify(event, state)
    }

    document.documentElement.addEventListener("mouseenter", onMouseEnter)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [dispatch, hasCursor, sm, scale, state, user, x, y, alone, measure])

  const render = state && hasCursor

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 isolate z-[100] size-full select-none overflow-hidden"
    >
      <AnimatePresence initial={false}>
        {render ? <Cursor state={state} x={x} y={y} scale={scale} /> : null}
      </AnimatePresence>
    </div>
  )
}
