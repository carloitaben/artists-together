"use client"

import { Cursor, CursorState } from "ws-types"
import { PerfectCursor } from "perfect-cursors"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { motion, MotionStyle, Variants } from "framer-motion"

import { useWebSocketEvent } from "~/hooks/ws"

import CursorLabel from "./CursorLabel"

const variants: Variants = {
  hide: {
    scale: 0,
  },
  show: {
    scale: 1,
  },
  press: {
    scale: 0.9,
  },
}

type Props = {
  cursor: Cursor | null
  id: string
  setPaths: Dispatch<SetStateAction<Map<string, string[]>>>
  render: (points: Point[], id: string) => void
}

type Point = [x: number, y: number]

export default function Cursor({ cursor, id, render, setPaths }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pointsRef = useRef<Point[]>([])
  const pressingRef = useRef(false)

  const [state, setState] = useState<CursorState>(cursor ? cursor[4] : "idle")

  const [pc] = useState(
    () =>
      new PerfectCursor((point) => {
        containerRef.current?.style.setProperty(
          "transform",
          `translate(${point[0]}%, ${point[1]}%)`,
        )
      }),
  )

  useWebSocketEvent("cursor:update", ([_id, cursor]) => {
    if (_id !== id || !cursor || !wrapperRef.current) return

    wrapperRef.current.style.width = `${cursor[2]}px`
    wrapperRef.current.style.height = `${cursor[3]}px`
    pc.addPoint([cursor[0], cursor[1]])
    setState(cursor[4])

    if (cursor[4] !== "press") {
      return (pressingRef.current = false)
    }

    if (!pressingRef.current) {
      pointsRef.current = []
      pressingRef.current = true
      return setPaths((current) => {
        const map = new Map(current)
        return map.set(id, [...(map.get(id) || []), ""])
      })
    }

    const x = (cursor[0] / 100) * cursor[2]
    const y = (cursor[1] / 100) * cursor[3]
    pointsRef.current = [...pointsRef.current, [x, y]]
    render(pointsRef.current, id)
  })

  if (!cursor) return null

  const [x, y] = cursor

  const containerStyle: MotionStyle = {
    x: `${x}%`,
    y: `${y}%`,
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute left-0 top-0"
      style={{ width: cursor[2], height: cursor[3] }}
    >
      <motion.div
        ref={containerRef}
        style={containerStyle}
        className="absolute inset-0"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="none"
          initial="hide"
          animate={state === "press" ? "press" : "show"}
          exit="hide"
          className="inline-block drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
          variants={variants}
        >
          <path
            fill="#FAFAFA"
            d="M1.523 3.052a1.526 1.526 0 0 1 1.528-1.525l16.57.038c.404 0 .79.16 1.075.446l41.332 41.331c.297.297.446.686.446 1.079 0 .393-.15.781-.446 1.079L45.496 62.03a1.526 1.526 0 0 1-2.158 0L2.011 20.704a1.517 1.517 0 0 1-.446-1.075L1.527 3.055l-.004-.003Z"
          />
          <path
            fill="#FAFAFA"
            d="M7.542 24.073h5.508v-5.508h5.512v-5.512h5.511V7.545"
          />
          <path
            fill="#0D0D0D"
            d="m46.574 63.106 16.532-16.532a3.052 3.052 0 0 0 0-4.314L21.775.936a3.035 3.035 0 0 0-2.15-.892L3.055.002c-.812 0-1.59.32-2.165.892A3.052 3.052 0 0 0-.002 3.05v.008l.038 16.57c0 .808.324 1.578.892 2.15l41.328 41.327a3.05 3.05 0 0 0 4.31 0h.008Zm10.273-14.584L54.03 51.34a.38.38 0 0 1-.537 0L20.31 18.158a.756.756 0 0 1-.225-.538v-2.847c0-.107.084-.19.19-.19h2.848a.75.75 0 0 1 .538.224l33.185 33.178a.38.38 0 0 1 0 .537Zm3.835-3.834-1.14 1.14a.38.38 0 0 1-.537 0L25.819 12.645a.756.756 0 0 1-.225-.538V9.531c0-.171.206-.255.324-.133l34.76 34.752a.38.38 0 0 1 0 .538h.004ZM3.086 19.308 3.07 13.05c0-.202.08-.397.225-.542l9.21-9.209a.765.765 0 0 1 .54-.225l6.26.016a.75.75 0 0 1 .537.224l2.482 2.482a.756.756 0 0 1 .225.537v5.005c0 .107-.084.19-.191.19h-3.797c-.842 0-1.524.683-1.524 1.525v3.797c0 .107-.084.19-.19.19H13.05c-.843 0-1.525.683-1.525 1.525v3.797c0 .107-.084.19-.19.19H6.012l-2.706-2.706a.782.782 0 0 1-.225-.537h.004Zm11.679.782h2.847a.75.75 0 0 1 .538.225L51.33 53.497a.38.38 0 0 1 0 .537l-2.817 2.817a.38.38 0 0 1-.537 0L14.795 23.669a.756.756 0 0 1-.225-.537v-2.848c0-.106.084-.19.191-.19l.004-.004Zm-5.241 5.512H12.1a.75.75 0 0 1 .537.225L45.82 59.008a.38.38 0 0 1 0 .538l-1.14 1.14a.38.38 0 0 1-.538 0L9.386 25.93a.19.19 0 0 1 .134-.324l.004-.004Z"
          />
        </motion.svg>
        <CursorLabel className="-translate-x-1 -translate-y-3" emoji>
          {cursor[5]}
        </CursorLabel>
      </motion.div>
    </div>
  )
}
