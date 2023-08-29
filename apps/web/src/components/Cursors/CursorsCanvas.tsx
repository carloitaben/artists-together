"use client"

import throttle from "just-throttle"
import { User } from "lucia"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Cursor } from "ws-types"

import { useHasCursor } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"

import CursorComponent from "./Cursor"

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

type Props = {
  user: User | undefined
}

export default function CursorsCanvas({ user }: Props) {
  const [cursors, setCursors] = useState(new Map<string, Cursor | null>())
  const hasCursor = useHasCursor()

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
    let pressing = false

    const interval = cursors.size === 0 ? 3000 : 30

    function update(x: number, y: number) {
      if (!user) return

      const xPercent = limit((x * 100) / document.documentElement.scrollWidth)
      const yPercent = limit((y * 100) / document.documentElement.scrollHeight)

      updateCursor([
        xPercent,
        yPercent,
        pressing ? "press" : "idle",
        user.username,
      ])
    }

    const queue = throttle<typeof update>(update, interval)

    if (!hasCursor || !user) {
      queue.cancel()
      return updateCursor(null)
    }

    function onMouseDown(event: MouseEvent) {
      queue.cancel()
      pressing = true
      update(event.pageX, event.pageY)
    }

    function onMouseUp(event: MouseEvent) {
      queue.cancel()
      pressing = false
      update(event.pageX, event.pageY)
    }

    function onMouseMove(event: MouseEvent) {
      queue(event.pageX, event.pageY)
    }

    window.addEventListener("mousedown", onMouseDown, true)
    window.addEventListener("mouseup", onMouseUp, true)
    window.addEventListener("mousemove", onMouseMove, true)

    return () => {
      queue.cancel()
      window.removeEventListener("mousedown", onMouseDown, true)
      window.removeEventListener("mouseup", onMouseUp, true)
      window.removeEventListener("mousemove", onMouseMove, true)
    }
  }, [cursors.size, hasCursor, updateCursor, user])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:js:block"
    >
      <AnimatePresence>
        {Array.from(cursors.entries()).map(([id, cursor]) => (
          <CursorComponent key={id} id={id} cursor={cursor} />
        ))}
      </AnimatePresence>
    </div>
  )
}
