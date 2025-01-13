import type {
  CursorState,
  CursorUpdates,
} from "@artists-together/core/websocket"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { AnimatePresence, clamp, useMotionValue, useSpring } from "motion/react"
import { throttle } from "radashi"
import { useEffect, useState } from "react"
import { useScreen } from "~/lib/media"
import { authenticateQueryOptions } from "~/services/auth/shared"
import { useWebSocket, webSocketQueryOptions } from "~/lib/websocket"
import { ATTR_NAME_DATA_CURSOR_PRECISION } from "./CursorPrecision"
import { measure } from "./measure"
import Cursor from "./Cursor"

const limit = clamp.bind(null, 0, 1)

export default function Me() {
  const [state, setState] = useState<CursorState>()
  const auth = useSuspenseQuery(authenticateQueryOptions)
  const webSocket = useWebSocket()
  const alone = useQuery({
    ...webSocketQueryOptions("room:update", {
      count: 0,
      members: [],
    }),
    select: (data) => data.count < 2,
  })

  const sm = useScreen("sm")
  const hasCursor = useScreen("cursor")

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useSpring(0, { mass: 0.05, stiffness: 200 })

  const render = state && hasCursor

  useEffect(() => {
    if (!hasCursor) {
      return document.documentElement.classList.remove("cursor")
    }

    document.documentElement.classList.add("cursor")

    let timestamp: number | undefined = undefined
    let updates: CursorUpdates = []

    const notify = throttle(
      {
        interval: alone.data ? 5_000 : 500,
        trailing: true,
      },
      () => {
        webSocket.send("cursor:update", updates)
        timestamp = undefined
        updates = []
      },
    )

    const update = throttle(
      {
        interval: alone.data ? 5_000 : 60,
        trailing: true,
      },
      (event: MouseEvent, state?: CursorState) => {
        if (!auth.data || !sm) return

        const now = Date.now()
        const delta = typeof timestamp === "number" ? now - timestamp : 0

        timestamp = now

        if (!state) {
          alone.data ? (updates = [[delta, null]]) : updates.push([delta, null])
          return notify()
        }

        const target =
          event.target &&
          event.target instanceof Element &&
          event.target.closest(`[${ATTR_NAME_DATA_CURSOR_PRECISION}]`)

        if (!target) {
          return notify()
        }

        const targetAttribute = target.getAttribute(
          ATTR_NAME_DATA_CURSOR_PRECISION,
        )

        if (!targetAttribute) {
          throw new Error(
            `Missing attribute "${ATTR_NAME_DATA_CURSOR_PRECISION}" on event target`,
          )
        }

        const rect = measure({
          element: target,
          attribute: targetAttribute,
        })

        if (!rect) {
          const error = new Error(
            `Could not measure "${targetAttribute}" precision area`,
          )

          if (import.meta.env.DEV) {
            throw error
          } else {
            return notify()
          }
        }

        const x = limit((event.clientX - rect.x) / rect.width)
        const y = limit((event.clientY - rect.y) / rect.height)

        const cursorUpdate: CursorUpdates[number] = [
          delta,
          {
            x,
            y,
            state,
            target: targetAttribute,
          },
        ]

        alone.data ? (updates = [cursorUpdate]) : updates.push(cursorUpdate)

        return notify()
      },
    )

    function onMouseEnter(event: MouseEvent) {
      x.jump(event.clientX)
      y.jump(event.clientY)
      setState("idle")
      update.trigger(event, "idle")
    }

    function onMouseLeave(event: MouseEvent) {
      setState(undefined)
      update.trigger(event)
    }

    function onMouseMove(event: MouseEvent) {
      if (!state) {
        x.jump(event.clientX)
        y.jump(event.clientY)
        setState("idle")
        return update(event, "idle")
      }

      x.set(event.clientX)
      y.set(event.clientY)
      update(event, state)
    }

    function onMouseDown(event: MouseEvent) {
      scale.set(0.9)
      update.trigger(event, state)
    }

    function onMouseUp(event: MouseEvent) {
      scale.set(1)
      update.trigger(event, state)
    }

    document.documentElement.addEventListener("mouseenter", onMouseEnter)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      document.documentElement.removeEventListener("mouseenter", onMouseEnter)
      document.documentElement.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [hasCursor, sm, scale, state, x, y, alone.data, webSocket, auth.data])

  return (
    <AnimatePresence initial={false}>
      {render ? (
        <Cursor
          position="fixed"
          className="isolate z-[999]"
          state={state}
          style={{ scale, x, y }}
        />
      ) : null}
    </AnimatePresence>
  )
}
