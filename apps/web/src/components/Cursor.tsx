"use client"

import {
  AnimatePresence,
  Variants,
  motion,
  useMotionTemplate,
  useSpring,
} from "framer-motion"
import { useEffect, useState } from "react"
import { Cursor as CursorType } from "ws-types"
import { CursorState } from "ws-types"

import { useMatchesMedia } from "~/hooks/media"
import CursorLabel from "./Cursors/CursorLabel"
import { useWebSocketEvent } from "~/hooks/ws"

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

const idle = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    className="drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
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
  </svg>
)

const drag = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    className="drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
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
  </svg>
)

const cursorStateSvg = {
  idle,
  drag,
} satisfies Partial<Record<CursorState, JSX.Element>>

const variants: Variants = {
  hide: {
    scale: 0,
    transition: {
      type: "spring",
      mass: 0.05,
    },
  },
  show: {
    scale: 1,
    transition: {
      type: "spring",
      mass: 0.05,
    },
  },
}

export default function Cursor() {
  const [cursors, setCursors] = useState(new Map<string, CursorType | null>())

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

  const [state, setState] = useState<keyof typeof cursorStateSvg>()
  const coarse = useMatchesMedia("(pointer: coarse)")

  const motionValueScale = useSpring(1, { mass: 0.05, stiffness: 200 })
  const motionValueX = useSpring(0, { mass: 0.05, stiffness: 175 })
  const motionValueY = useSpring(0, { mass: 0.05, stiffness: 175 })
  const percentX = useMotionTemplate`${motionValueX}%`
  const percentY = useMotionTemplate`${motionValueY}%`

  useEffect(() => {
    if (coarse) {
      return document.documentElement.classList.remove("cursor")
    }

    document.documentElement.classList.add("cursor")

    function onMouseEnter(event: MouseEvent) {
      const x = limit((event.clientX * 100) / window.innerWidth)
      const y = limit((event.clientY * 100) / window.innerHeight)
      motionValueX.jump(x)
      motionValueY.jump(y)
      setState("idle")
    }

    function onMouseLeave() {
      setState(undefined)
    }

    function onMouseMove(event: MouseEvent) {
      const x = limit((event.clientX * 100) / window.innerWidth)
      const y = limit((event.clientY * 100) / window.innerHeight)

      if (!state) {
        motionValueX.jump(x)
        motionValueY.jump(y)
        return setState("idle")
      }

      motionValueX.set(x)
      motionValueY.set(y)
    }

    function onMouseDown() {
      motionValueScale.set(0.9)
    }

    function onMouseUp() {
      motionValueScale.set(1)
    }

    document.documentElement.addEventListener("mouseenter", onMouseEnter)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [coarse, state, motionValueScale, motionValueX, motionValueY])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 hidden overflow-hidden js:block"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          x: percentX,
          y: percentY,
        }}
      >
        <AnimatePresence initial={false}>
          {!coarse && state ? (
            <motion.div
              className="relative inline-flex items-start"
              initial="hide"
              animate="show"
              exit="hide"
              variants={variants}
            >
              <motion.div
                className="inline-block"
                style={{ scale: motionValueScale }}
              >
                {cursorStateSvg[state]}
              </motion.div>
              <AnimatePresence initial={false}>
                {cursors.size > 0 ? (
                  <motion.div
                    initial="hide"
                    animate="show"
                    exit="hide"
                    className="inline-flex -translate-x-1 -translate-y-3"
                    variants={variants}
                  >
                    <CursorLabel>You</CursorLabel>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
