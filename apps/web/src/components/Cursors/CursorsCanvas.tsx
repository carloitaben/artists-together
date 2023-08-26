"use client"

import throttle from "just-throttle"
import useResizeObserver from "@react-hook/resize-observer"
import { Cursor } from "ws-types"
import { getStroke } from "perfect-freehand"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence } from "framer-motion"

import { useMatchesMedia } from "~/hooks/media"
import { useWebSocketEvent, useWebSocketEmitter } from "~/hooks/ws"
import { $cursor } from "~/stores/cursor"

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
    2,
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1],
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2,
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
  const [paths, setPaths] = useState(new Map<string, string[]>())
  const svgRef = useRef<SVGSVGElement>(null)
  const hasCursor = useMatchesMedia("(pointer: fine)")

  const documentRect =
    useRef<Pick<HTMLElement, "scrollWidth" | "scrollHeight">>()

  useResizeObserver(
    typeof document === "undefined" ? null : document.body,
    () => {
      documentRect.current = {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
      }
    },
  )

  useLayoutEffect(() => {
    documentRect.current = {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    }
  }, [])

  const render = useCallback((points: Point[], id: string) => {
    if (!svgRef.current) return

    const path = svgRef.current.querySelector<SVGPathElement>(
      `g[data-id="${id}"] path:last-child`,
    )

    if (!path) return

    path.setAttribute(
      "d",
      getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0,
          smoothing: 0.5,
          streamline: 0.5,
        }),
        points.length > 1,
      ),
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

    function update(x: number, y: number) {
      if (!documentRect.current) return

      const xPercent = limit((x * 100) / documentRect.current.scrollWidth)
      const yPercent = limit((y * 100) / documentRect.current.scrollHeight)

      updateCursor([
        xPercent,
        yPercent,
        documentRect.current.scrollWidth,
        documentRect.current.scrollHeight,
        pressing ? "press" : "idle",
        emoji,
      ])
    }

    const queue = throttle<typeof update>(update, interval)

    if (!hasCursor) {
      queue.cancel()
      return updateCursor(null)
    }

    function onMouseDown() {
      pressing = true
      const cursor = $cursor.get()
      update(cursor.x, cursor.y)

      if (window.getSelection) {
        window.getSelection()?.removeAllRanges()
      }

      document.body.classList.add(
        "select-none",
        "touch-none",
        "overflow-hidden",
      )

      setPaths((current) => {
        const map = new Map(current)
        return map.set("self", [...(map.get("self") || []), ""])
      })

      points = []
    }

    function onMouseUp() {
      const cursor = $cursor.get()

      pressing = false
      points = [...points, [cursor.x, cursor.y]]
      document.body.classList.remove(
        "select-none",
        "touch-none",
        "overflow-hidden",
      )

      render(points, "self")
      update(cursor.x, cursor.y)
    }

    function onMouseMove(event: MouseEvent) {
      const cursor = $cursor.get()
      queue(cursor.x, cursor.y)

      if (event.buttons === 1) {
        points = [...points, [cursor.x, cursor.y]]
        render(points, "self")
      }
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
        {Array.from(paths.entries()).map(([id, paths]) => (
          <g key={id} data-id={id}>
            {paths.map((path, index) => (
              <path
                key={index}
                d={path}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
              />
            ))}
          </g>
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
