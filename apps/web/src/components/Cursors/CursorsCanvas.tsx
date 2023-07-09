"use client"

import throttle from "just-throttle"
import { Cursor } from "ws-types"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"

import { User } from "~/services/auth"
import { useMatchesMedia } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"

import CursorComponent from "./Cursor"

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

type Props = {
  user: User
  emoji: string
}

export default function CursorsCanvas({ user, emoji }: Props) {
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
    let pressing = false

    const interval = cursors.size === 0 ? 3000 : 80

    const update = throttle((x: number, y: number) => {
      const scrollWidth = document.documentElement.scrollWidth
      const scrollHeight = document.documentElement.scrollHeight
      const xPercent = limit((x * 100) / scrollWidth)
      const yPercent = limit((y * 100) / scrollHeight)

      updateCursor([
        xPercent,
        yPercent,
        scrollWidth,
        scrollHeight,
        pressing ? "press" : "idle",
        emoji,
      ])
    }, interval)

    if (!hasCursor) {
      update.cancel()
      return updateCursor(null)
    }

    function onMouseDown(event: MouseEvent) {
      pressing = true
      update(event.pageX, event.pageY)
    }

    function onMouseUp(event: MouseEvent) {
      pressing = false
      update(event.pageX, event.pageY)
    }

    function onMouseMove(event: MouseEvent) {
      update(event.pageX, event.pageY)
    }

    window.addEventListener("mousedown", onMouseDown, true)
    window.addEventListener("mouseup", onMouseUp, true)
    window.addEventListener("mousemove", onMouseMove, true)

    return () => {
      update.cancel()
      window.removeEventListener("mousedown", onMouseDown, true)
      window.removeEventListener("mouseup", onMouseUp, true)
      window.removeEventListener("mousemove", onMouseMove, true)
    }
  }, [cursors.size, emoji, hasCursor, updateCursor, user])

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
