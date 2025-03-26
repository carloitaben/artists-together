"use client"

import type {
  Cursor as CursorType,
  CursorState,
  CursorUpdates,
} from "@artists-together/core/websocket"
import { QueryObserver, useQueryClient } from "@tanstack/react-query"
import type { Spring } from "motion/react"
import { AnimatePresence, useMotionTemplate, useSpring } from "motion/react"
import { PerfectCursor } from "perfect-cursors"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef, useEffect, useState } from "react"
import { webSocketQueryOptions } from "~/lib/websocket"
import Cursor from "./Cursor"
import { ATTR_NAME_DATA_CURSOR_PRECISION, measure, SCOPE_ROOT } from "./lib"

type Props = {
  username: string
  cursor: CursorType
}

const spring: Spring = {
  type: "spring",
  mass: 0.1,
}

function CursorPresence(
  { cursor, username }: Props,
  ref: ForwardedRef<ComponentRef<typeof Cursor>>,
) {
  const [state, setState] = useState<CursorState>()
  const queryClient = useQueryClient()
  const x = useSpring(cursor?.x || 0, spring)
  const y = useSpring(cursor?.y || 0, spring)
  const transform = useMotionTemplate`translateX(${x}%) translateY(${y}%)`

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

    let timeout: NodeJS.Timeout | undefined
    let updates: CursorUpdates = []

    function update() {
      const current = updates.shift()

      if (!current) {
        timeout = undefined
        return
      }

      const [delta, cursor] = current

      timeout = setTimeout(() => {
        setState(cursor?.state)

        if (!cursor) {
          return update()
        }

        const element =
          cursor.target === SCOPE_ROOT
            ? document.documentElement
            : document.querySelector(
                `[${ATTR_NAME_DATA_CURSOR_PRECISION}="${cursor.target}"]`,
              )

        if (!element) {
          if (process.env.NODE_ENV === "development") {
            throw Error(`Could not find cursor target "${cursor.target}"`)
          }

          return update()
        }

        const rect = measure(cursor.target, element)

        const x =
          ((rect.x +
            document.documentElement.scrollLeft +
            cursor.x * rect.width) /
            document.documentElement.offsetWidth) *
          100

        const y =
          ((rect.y +
            document.documentElement.scrollTop +
            cursor.y * rect.height) /
            document.documentElement.offsetHeight) *
          100

        if (pc.prevPoint) {
          pc.addPoint([x, y])
        } else {
          pc.prevPoint = [x, y]
        }

        update()
      }, delta)
    }

    const unsubscribe = observer.subscribe((context) => {
      if (context.data) {
        updates.push(...context.data)
        if (!timeout) update()
      }
    })

    return () => {
      unsubscribe()
      updates = []
      if (timeout) clearTimeout(timeout)
    }
  }, [pc, queryClient, cursor, username])

  return (
    <AnimatePresence>
      {state ? (
        <Cursor
          ref={ref}
          state={state}
          username={username}
          style={{ transform }}
        />
      ) : null}
    </AnimatePresence>
  )
}

export default forwardRef(CursorPresence)
