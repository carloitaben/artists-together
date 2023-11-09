import type { Variants } from "framer-motion"
import {
  AnimatePresence,
  useMotionTemplate,
  useSpring,
  clamp,
  motion,
} from "framer-motion"
import type { CursorState } from "ws"
import { useEffect, useState } from "react"
import { useMeasure, useScreen } from "~/hooks/media"
import Icon from "./Icon"

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

const sprites = {
  idle: "cursor-idle",
  drag: "cursor-idle",
  hover: "cursor-idle",
  press: "cursor-idle",
} satisfies Record<CursorState, string>

export default function Cursor() {
  const [state, setState] = useState<CursorState | null>(null)
  const cursor = useScreen("cursor")

  const documentRect = useMeasure(() => document.documentElement)

  const scale = useSpring(1, { mass: 0.05, stiffness: 200 })
  const positionX = useSpring(0, { mass: 0.025, stiffness: 175 })
  const positionY = useSpring(0, { mass: 0.025, stiffness: 175 })
  const positionPercentX = useMotionTemplate`${positionX}%`
  const positionPercentY = useMotionTemplate`${positionY}%`

  useEffect(() => {
    if (!cursor) {
      return document.documentElement.classList.remove("cursor")
    }

    document.documentElement.classList.add("cursor")

    function onMouseEnter(event: MouseEvent) {
      if (!documentRect.current) return

      const x = clamp(
        0,
        100,
        (event.clientX * 100) / documentRect.current.contentRect.width,
      )

      const y = clamp(
        0,
        100,
        (event.clientY * 100) / documentRect.current.contentRect.height,
      )

      positionX.jump(x)
      positionX.jump(y)
      setState("idle")
    }

    function onMouseLeave() {
      setState(null)
    }

    function onMouseMove(event: MouseEvent) {
      if (!documentRect.current) return

      const x = clamp(
        0,
        100,
        (event.clientX * 100) / documentRect.current.contentRect.width,
      )

      const y = clamp(
        0,
        100,
        (event.clientY * 100) / documentRect.current.contentRect.height,
      )

      positionX.set(x)
      positionY.set(y)
    }

    function onMouseDown() {
      scale.set(0.9)
    }

    function onMouseUp() {
      scale.set(1)
    }

    document.documentElement.addEventListener("mouseenter", onMouseEnter, {
      passive: true,
    })

    document.documentElement.addEventListener("mouseleave", onMouseLeave, {
      passive: true,
    })

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("mousedown", onMouseDown, { passive: true })
    window.addEventListener("mouseup", onMouseUp, { passive: true })

    return () => {
      document.documentElement.removeEventListener("mouseenter", onMouseEnter)
      document.documentElement.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [positionX, positionY, cursor, scale, documentRect])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          x: positionPercentX,
          y: positionPercentY,
        }}
      >
        <AnimatePresence initial={false}>
          {cursor && state ? (
            <motion.div
              className="inline-block"
              initial="hide"
              animate="show"
              exit="hide"
              variants={variants}
            >
              <motion.div className="inline-block" style={{ scale }}>
                <Icon
                  name={sprites[state]}
                  alt=""
                  className="w-6 h-8 drop-shadow-button"
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
