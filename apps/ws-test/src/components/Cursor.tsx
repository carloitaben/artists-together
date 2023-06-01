"use client"

import { AnimatePresence, MotionStyle, Variants, motion, useAnimate, useMotionTemplate, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import { CursorState } from "ws-types"

import { useMatchesMedia } from "~/hooks/media"

function limit(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return number
}

const idle = (
  <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.3667 28.6667L7.53333 18.2667L2 26V2L20.6667 16.6667H11.2L16 26.9667L12.3667 28.6667Z" fill="#FAFAFA" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.6826 30.5461C11.1834 30.3643 10.7769 29.9914 10.553 29.5096L7.16468 22.2189L3.62652 27.1638C3.12077 27.8706 2.21643 28.1699 1.38887 27.9044C0.561312 27.6388 0 26.8691 0 26V2.00002C0 1.23437 0.437108 0.535919 1.12572 0.201227C1.81434 -0.133465 2.6336 -0.0456518 3.23564 0.42738L21.9023 15.094C22.5727 15.6208 22.8355 16.5146 22.5568 17.3204C22.2781 18.1262 21.5193 18.6667 20.6667 18.6667H14.3386L17.8128 26.1219C18.2789 27.122 17.847 28.3106 16.8476 28.7782L13.2143 30.4782C12.733 30.7034 12.1819 30.7278 11.6826 30.5461ZM11.2 16.6667H20.6667L2 2.00002V26L7.53333 18.2667L12.3667 28.6667L15.9995 26.9669L11.2 16.6667Z"
      fill="#0D0D0D"
    />
  </svg>
)

const drag = (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
    <path
      fill="#FAFAFA"
      d="M21.333 36c-2.489 0-4.594-.689-6.316-2.067-1.723-1.377-2.961-3.033-3.717-4.966l-3.867-9.8c-.178-.445-.139-.861.117-1.25a1.223 1.223 0 0 1 1.083-.584c.445 0 1.011.15 1.7.45.69.3 1.178.806 1.467 1.517l1.7 4.267c.022.066.222.21.6.433h.567V8.333c0-.466.16-.86.483-1.183a1.61 1.61 0 0 1 1.183-.483c.467 0 .861.16 1.184.483.322.322.483.717.483 1.183v11a.64.64 0 0 0 .2.467.64.64 0 0 0 .467.2.64.64 0 0 0 .466-.2.64.64 0 0 0 .2-.467V5.667c0-.467.161-.861.484-1.184A1.61 1.61 0 0 1 21 4c.467 0 .861.161 1.183.483.323.323.484.717.484 1.184v13.666a.64.64 0 0 0 .2.467.64.64 0 0 0 .466.2.64.64 0 0 0 .467-.2.64.64 0 0 0 .2-.467V7.667c0-.467.161-.861.483-1.184A1.61 1.61 0 0 1 25.667 6c.466 0 .86.161 1.183.483.322.323.483.717.483 1.184v11.666a.64.64 0 0 0 .2.467.64.64 0 0 0 .467.2.64.64 0 0 0 .467-.2.64.64 0 0 0 .2-.467v-7.666c0-.467.16-.861.483-1.184A1.61 1.61 0 0 1 30.333 10c.467 0 .861.161 1.184.483.322.323.483.717.483 1.184v13.666c0 2.978-1.033 5.5-3.1 7.567S24.31 36 21.333 36Z"
    />
    <path
      fill="#0D0D0D"
      fillRule="evenodd"
      d="M14.1 24h.567V8.333c0-.466.16-.86.483-1.183a1.61 1.61 0 0 1 1.183-.483 1.612 1.612 0 0 1 1.184.483c.322.322.483.717.483 1.183v11a.64.64 0 0 0 .2.467.64.64 0 0 0 .467.2.64.64 0 0 0 .466-.2.64.64 0 0 0 .2-.467V5.667c0-.467.161-.861.484-1.184A1.61 1.61 0 0 1 21 4c.467 0 .861.161 1.183.483a1.596 1.596 0 0 1 .484 1.184v13.666a.64.64 0 0 0 .2.467.64.64 0 0 0 .466.2.64.64 0 0 0 .467-.2.64.64 0 0 0 .2-.467V7.667c0-.467.161-.861.483-1.184A1.612 1.612 0 0 1 25.666 6c.467 0 .862.161 1.184.483.322.323.483.717.483 1.184v11.666a.64.64 0 0 0 .2.467.64.64 0 0 0 .467.2.64.64 0 0 0 .467-.2.64.64 0 0 0 .2-.467v-7.666c0-.467.16-.861.483-1.184A1.612 1.612 0 0 1 30.333 10c.467 0 .861.161 1.184.483.322.323.483.717.483 1.184v13.666c0 2.978-1.033 5.5-3.1 7.567S24.31 36 21.333 36c-2.489 0-4.594-.689-6.316-2.067-1.723-1.377-2.961-3.033-3.717-4.966l-3.867-9.8c-.178-.445-.139-.861.117-1.25a1.223 1.223 0 0 1 1.083-.584c.445 0 1.011.15 1.7.45.69.3 1.178.806 1.467 1.517l1.7 4.267c.022.066.222.21.6.433Zm-1.433-6.99V8.333c0-.982.361-1.89 1.069-2.597a3.608 3.608 0 0 1 2.597-1.07c.378 0 .745.054 1.093.16a3.587 3.587 0 0 1 .976-1.757A3.608 3.608 0 0 1 21 2c.983 0 1.89.362 2.598 1.07.342.342.604.732.783 1.154A3.712 3.712 0 0 1 25.667 4c.982 0 1.89.362 2.597 1.07a3.608 3.608 0 0 1 1.07 2.597v.466c.32-.089.655-.133 1-.133.982 0 1.89.362 2.597 1.07A3.608 3.608 0 0 1 34 11.666v13.666c0 3.497-1.236 6.532-3.686 8.981-2.45 2.45-5.484 3.686-8.98 3.686-2.882 0-5.445-.807-7.567-2.505-1.977-1.582-3.437-3.518-4.329-5.797v-.003l-3.862-9.786-.002-.005c-.41-1.03-.321-2.134.304-3.086a3.22 3.22 0 0 1 2.755-1.485c.846 0 1.708.272 2.499.617.595.259 1.11.617 1.535 1.06Z"
      clipRule="evenodd"
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
  },
  show: {
    scale: 1,
  },
}

export default function Cursor() {
  const [state, setState] = useState<keyof typeof cursorStateSvg>()
  const coarse = useMatchesMedia("(pointer: coarse)")

  const motionValueScale = useSpring(1)
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
      motionValueX.set(x)
      motionValueY.set(y)
      setState("idle")
    }

    function onMouseDown(event: MouseEvent) {
      motionValueScale.set(0.9)
    }

    function onMouseUp(event: MouseEvent) {
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
  }, [coarse, motionValueScale, motionValueX, motionValueY])

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none hidden js:block">
      <motion.div
        className="absolute inset-0"
        style={{
          x: percentX,
          y: percentY,
        }}
      >
        <AnimatePresence initial={false}>
          {!coarse && state && (
            <motion.div
              className="inline-block"
              initial="hide"
              animate="show"
              exit="hide"
              variants={variants}
              style={{ scale: motionValueScale }}
            >
              {cursorStateSvg[state]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
