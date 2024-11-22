import type {
  CursorState,
  Cursor as CursorType,
} from "@artists-together/core/websocket"
import { QueryObserver, useQueryClient } from "@tanstack/react-query"
import { PerfectCursor } from "perfect-cursors"
import { useEffect, useState } from "react"
import { useMotionTemplate, useMotionValue } from "motion/react"
import { webSocketQueryOptions } from "~/lib/websocket"
import { useMeasure } from "./lib"
import { ATTR_NAME_DATA_CURSOR_PRECISION } from "./CursorPrecision"
import Cursor from "./Cursor"

type Props = {
  username: string
  cursor: CursorType
}

export default function CursorPresence({ cursor, username }: Props) {
  const [state, setState] = useState<CursorState>()
  const queryClient = useQueryClient()
  const measure = useMeasure()
  const x = useMotionValue(cursor?.x || 0)
  const y = useMotionValue(cursor?.y || 0)
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
    const observer = new QueryObserver(
      queryClient,
      webSocketQueryOptions("cursor:update", {
        cursor,
        username,
      }),
    )

    return observer.subscribe((context) => {
      if (!context.data) return
      if (context.data.username !== username) return
      if (!context.data.cursor) return setState(undefined)

      setState(context.data.cursor.state)

      const selector = `[${ATTR_NAME_DATA_CURSOR_PRECISION}="${context.data.cursor.target}"]`

      const rect = measure(
        selector,
        () => document.querySelector(selector) || document.documentElement,
      )

      console.log("measured rect for", context.data.cursor.target, {
        x: context.data.cursor.x,
        y: context.data.cursor.y,
      })

      const percentX =
        ((rect.x +
          document.documentElement.scrollLeft +
          context.data.cursor.x * rect.width) /
          document.documentElement.offsetWidth) *
        100

      const percentY =
        ((rect.y +
          document.documentElement.scrollTop +
          context.data.cursor.y * rect.height) /
          document.documentElement.offsetHeight) *
        100

      if (pc.prevPoint) {
        pc.addPoint([percentX, percentY])
      } else {
        pc.prevPoint = [percentX, percentY]
      }
    })
  }, [pc, queryClient, cursor, username, measure])

  if (!state) return null

  return <Cursor state={state} username={username} x={percentX} y={percentY} />
}
