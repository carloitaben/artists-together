import type {
  CursorState,
  Cursor as CursorType,
  CursorUpdates,
} from "@artists-together/core/websocket"
import { QueryObserver, useQueryClient } from "@tanstack/react-query"
import { PerfectCursor } from "perfect-cursors"
import { useEffect, useState } from "react"
import type { Spring } from "motion/react"
import { AnimatePresence, useMotionTemplate, useSpring } from "motion/react"
import { webSocketQueryOptions } from "~/lib/websocket"
import { ATTR_NAME_DATA_CURSOR_PRECISION } from "./CursorPrecision"
import Cursor from "./Cursor"

type Props = {
  username: string
  cursor: CursorType
}

const spring: Spring = {
  type: "spring",
  mass: 0.15,
}

export default function CursorPresence({ cursor, username }: Props) {
  const [state, setState] = useState<CursorState>()
  const queryClient = useQueryClient()
  const x = useSpring(cursor?.x || 0, spring)
  const y = useSpring(cursor?.y || 0, spring)
  const percentX = useMotionTemplate`${x}%`
  const percentY = useMotionTemplate`${y}%`

  const [pc] = useState(
    () =>
      new PerfectCursor((point) => {
        if (typeof point[0] === "number" && typeof point[1] === "number") {
          x.set(point[0])
          y.set(point[1])
        }
      }),
  )

  useEffect(() => {
    if (!state) {
      pc.dispose()
      pc.queue = []
      pc.prevPoint = undefined
    }
  }, [pc, state])

  useEffect(() => {
    const observer = new QueryObserver(queryClient, {
      ...webSocketQueryOptions("cursor:update", {
        cursor: [[0, cursor]],
        username,
      }),
      select: (data) => (data.username === username ? data.cursor : null),
    })

    function update(updates: CursorUpdates, index: number) {
      const [delta, cursor] = updates[index]!

      function maybeUpdate() {
        if (index === updates.length - 1) {
          update(updates, index + 1)
        }
      }

      const timeout = setTimeout(() => {
        setState(cursor?.state)

        if (!cursor) {
          return maybeUpdate()
        }

        const selector = `[${ATTR_NAME_DATA_CURSOR_PRECISION}="${cursor.target}"]`
        const element = document.querySelector(selector)

        if (!element) {
          if (import.meta.env.DEV) {
            throw Error(`Could not find cursor target "${cursor.target}"`)
          }

          return maybeUpdate()
        }

        const rect = element.getBoundingClientRect()

        const percentX =
          ((rect.x +
            document.documentElement.scrollLeft +
            cursor.x * rect.width) /
            document.documentElement.offsetWidth) *
          100

        const percentY =
          ((rect.y +
            document.documentElement.scrollTop +
            cursor.y * rect.height) /
            document.documentElement.offsetHeight) *
          100

        if (pc.prevPoint) {
          pc.addPoint([percentX, percentY])
        } else {
          pc.prevPoint = [percentX, percentY]
        }

        return maybeUpdate()
      }, delta)

      return () => clearTimeout(timeout)
    }

    return observer.subscribe((context) => {
      if (!context.data) return setState(undefined)

      update(context.data, 0)
    })
  }, [pc, queryClient, cursor, username])

  return (
    <AnimatePresence>
      {state ? (
        <Cursor
          state={state}
          username={username}
          style={{
            x: percentX,
            y: percentY,
          }}
        />
      ) : null}
    </AnimatePresence>
  )
}
