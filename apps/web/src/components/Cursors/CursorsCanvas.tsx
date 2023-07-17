"use client"

import throttle from "just-throttle"
import { User } from "lucia"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Cursor } from "ws-types"

import { clamp } from "~/lib/utils"
import { useMatchesMedia } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"

import { $elements } from "./store"
import CursorComponent from "./Cursor"

type Props = {
  user: User | undefined
}

export default function CursorsCanvas({ user }: Props) {
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

    // const interval = cursors.size === 0 ? 3000 : 80
    const interval = 80

    const update = throttle((x: number, y: number) => {
      // if (!user) return

      const elements = $elements.get()

      const element = elements.length
        ? elements[elements.length - 1]
        : document.documentElement

      const elementRect = element.getBoundingClientRect()

      const cursor = {
        x: x - elementRect.x,
        y: y - elementRect.y,
      }

      const percent = {
        x: clamp((cursor.x * 100) / elementRect.width, 0, 100),
        y: clamp((cursor.y * 100) / elementRect.height, 0, 100),
      }

      console.log(element.id, JSON.stringify(percent, null, 2))

      // const cursor = {
      //   x: x - elementRect.x - document.documentElement.scrollLeft,
      //   y: y - elementRect.y - document.documentElement.scrollTop,
      // }

      // const percent = {
      //   x: clamp(
      //     (cursor.x * 100) /
      //       (elementRect.x +
      //         element.scrollWidth +
      //         document.documentElement.scrollLeft),
      //     0,
      //     100
      //   ),
      //   y: clamp(
      //     (cursor.y * 100) /
      //       (elementRect.y +
      //         element.scrollHeight +
      //         document.documentElement.scrollTop),
      //     0,
      //     100
      //   ),
      // }

      updateCursor([
        element.id,
        percent.x,
        percent.y,
        pressing ? "press" : "idle",
        user.username,
      ])
    }, interval)

    // if (!hasCursor || !user) {
    if (!hasCursor) {
      update.cancel()
      return updateCursor(null)
    }

    function onMouseDown(event: MouseEvent) {
      pressing = true
      update(event.clientX, event.clientY)
    }

    function onMouseUp(event: MouseEvent) {
      pressing = false
      update(event.clientX, event.clientY)
    }

    function onMouseMove(event: MouseEvent) {
      update(event.clientX, event.clientY)
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
