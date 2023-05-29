"use client"

import throttle from "just-throttle"
import { Cursor } from "ws-types"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"

import { useMatchesMedia } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"

import CursorComponent from "./Cursor"

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

export default function CursorsCanvas() {
  const [cursors, setCursors] = useState(new Map<string, Cursor | null>())
  const hasCursor = useMatchesMedia("(pointer: fine)")

  useWebSocketEvent("room:join", (room) => {
    setCursors(new Map(room))
  })

  useWebSocketEvent("room:newconnection", ([id, cursor]) => {
    setCursors((current) => new Map(current.set(id, cursor)))
  })

  useWebSocketEvent("room:newdisconnection", (id) => {
    setCursors((current) => {
      current.delete(id)
      return new Map(current)
    })
  })

  useWebSocketEvent("cursor:update", ([id, cursor]) => {
    if (!cursors.get(id)) {
      return setCursors((current) => new Map(current.set(id, cursor)))
    }

    if (!cursor) {
      return setCursors((current) => {
        current.delete(id)
        return new Map(current)
      })
    }
  })

  const updateCursor = useWebSocketEmitter("cursor")

  useEffect(() => {
    if (!hasCursor) return updateCursor(null)

    const interval = cursors.size === 0 ? 3000 : 80

    const update = throttle(([x, y, press]: NonNullable<Cursor>) => {
      const xPercent = limit((x * 100) / document.documentElement.scrollWidth)
      const yPercent = limit((y * 100) / document.documentElement.scrollHeight)
      updateCursor([xPercent, yPercent, press])
    }, interval)

    function onMouseMove(event: MouseEvent) {
      update([event.pageX, event.pageY, false])
    }

    window.addEventListener("mousemove", onMouseMove)
    return () => {
      update.cancel()
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [cursors.size, hasCursor, updateCursor])

  return (
    <div
      aria-hidden
      className="absolute overflow-hidden inset-0 pointer-events-none ring-4 ring-red-500 ring-inset hidden md:block"
    >
      <AnimatePresence>
        {Array.from(cursors.entries()).map(([id, cursor]) => (
          <CursorComponent key={id} id={id} cursor={cursor} />
        ))}
      </AnimatePresence>
    </div>
  )
}
