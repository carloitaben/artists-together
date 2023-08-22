"use client"

import throttle from "just-throttle"
import { Cursor } from "ws-types"
import { getStroke } from "perfect-freehand"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"

import { useMatchesMedia } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"

import CursorComponent from "./Cursor"

type Point = [x: number, y: number]

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

function average(a: number, b: number) {
  return (a + b) / 2
}

function getSvgPathFromStroke(points: number[][], closed = true) {
  const len = points.length

  if (len < 4) return ""

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `
  }

  if (closed) {
    result += "Z"
  }

  return result
}

type Props = {
  emoji: string
}

export default function CursorsCanvas({ emoji }: Props) {
  const [cursors, setCursors] = useState(new Map<string, Cursor | null>())
  const [paths, setPaths] = useState<string[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const hasCursor = useMatchesMedia("(pointer: fine)")

  const render = useCallback((points: Point[]) => {
    if (!svgRef.current) return

    const path = svgRef.current.querySelector<SVGPathElement>("path:last-child")
    if (!path) return

    path.setAttribute(
      "d",
      getSvgPathFromStroke(
        getStroke(points, {
          size: 20,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        }),
        points.length > 1
      )
    )
  }, [])

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
    let points: Point[] = []

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

      if (window.getSelection) window.getSelection()?.removeAllRanges()

      document.body.classList.add(
        "select-none",
        "touch-none",
        "overflow-hidden"
      )

      setPaths((current) => [...current, ""])
      points = []
    }

    function onMouseUp(event: MouseEvent) {
      pressing = false
      points = [...points, [event.pageX, event.pageY]]
      document.body.classList.remove(
        "select-none",
        "touch-none",
        "overflow-hidden"
      )
      render(points)
      update(event.pageX, event.pageY)
    }

    function onMouseMove(event: MouseEvent) {
      update(event.pageX, event.pageY)

      if (event.buttons === 1) {
        points = [...points, [event.pageX, event.pageY]]
        render(points)
      }
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
  }, [cursors.size, emoji, hasCursor, render, updateCursor])

  return (
    <>
      <svg
        aria-hidden
        ref={svgRef}
        className="pointer-events-none absolute inset-0 hidden overflow-hidden md:js:block"
        fill="none"
        width="100%"
        height="100%"
      >
        {paths.map((path, index) => (
          <path
            key={index}
            d={path}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
          />
        ))}
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-hidden md:js:block"
      >
        <AnimatePresence>
          {Array.from(cursors.entries()).map(([id, cursor]) => (
            <CursorComponent
              key={id}
              id={id}
              cursor={cursor}
              render={render}
              setPaths={setPaths}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
