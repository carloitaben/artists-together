import type {
  CursorState,
  Cursor as CursorType,
} from "@artists-together/core/websocket"
import { PerfectCursor } from "perfect-cursors"
import { useCallback, useEffect, useState } from "react"
import { useMotionTemplate, useMotionValue } from "framer-motion"
import type { SubscribeCallback } from "~/lib/websocket"
import { ATTR_NAME_DATA_CURSOR_PRECISION } from "./CursorPrecision"
import { useMeasure } from "./lib"
import Cursor from "./Cursor"

type Props = {
  username: string
  cursor: CursorType
}

export default function CursorPresence({ cursor, username }: Props) {
  const [state, setState] = useState<CursorState>()
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

  const onCursorUpdate = useCallback<SubscribeCallback<"cursor:update">>(
    (payload) => {
      if (payload.username !== username) return
      if (!payload.cursor) return setState(undefined)

      setState(payload.cursor.state)

      const selector = `[${ATTR_NAME_DATA_CURSOR_PRECISION}="${payload.cursor.target}"]`

      const rect = measure(
        selector,
        () => document.querySelector(selector) || document.documentElement,
      )

      const percentX =
        ((rect.x +
          document.documentElement.scrollLeft +
          payload.cursor.x * rect.width) /
          document.documentElement.offsetWidth) *
        100

      const percentY =
        ((rect.y +
          document.documentElement.scrollTop +
          payload.cursor.y * rect.height) /
          document.documentElement.offsetHeight) *
        100

      if (pc.prevPoint) {
        pc.addPoint([percentX, percentY])
      } else {
        pc.prevPoint = [percentX, percentY]
      }
    },
    [measure, pc, username],
  )

  useEffect(() => {
    onCursorUpdate({ cursor, username })
  }, [cursor, onCursorUpdate, username])

  useEffect(() => {
    if (!state) {
      pc.dispose()
      pc.queue = []
      pc.prevPoint = undefined
    }
  }, [pc, state])

  // useWebSocketEvent("cursor:update", onCursorUpdate)

  if (!state) return null

  return <Cursor state={state} username={username} x={percentX} y={percentY} />
}
