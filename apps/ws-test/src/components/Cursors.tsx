"use client"

import throttle from "just-throttle"
import { useEffect, useState } from "react"
import { useAnimate, motion, MotionStyle, AnimatePresence, Variants } from "framer-motion"
import { useWebSocketEvent, useWebSocketEmitter, Cursor } from "~/hooks/ws"

function compressMouseMove(number: number) {
  if (number < 0) return 0
  if (number > 100) return 100
  return Math.round(number * 100) / 100
}

const variants: Variants = {
  hide: {
    opacity: 0,
    scale: 0.5,
  },
  show: {
    opacity: 1,
    scale: 1,
  },
  press: {
    scale: 0.9,
  },
}

export default function Cursors() {
  const [cursors, setCursors] = useState(new Map<string, Cursor | null>())
  const [scope, animate] = useAnimate()

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
    if (!cursors.has(id)) {
      return setCursors((current) => new Map(current.set(id, cursor)))
    }

    const [x, y, press] = cursor

    animate(`[data-id="${id}"]`, {
      x: `${x}%`,
      y: `${y}%`,
    })
  })

  const updateCursor = useWebSocketEmitter("cursor")

  useEffect(() => {
    const update = throttle(
      ([x, y, press]: Cursor) => {
        const xPercent = compressMouseMove((x * 100) / window.innerWidth)
        const yPercent = compressMouseMove((y * 100) / window.innerHeight)
        updateCursor([xPercent, yPercent, press])
      },
      500,
      {
        leading: true,
      }
    )

    function onMouseMove(event: MouseEvent) {
      update([event.x, event.y, false])
    }

    window.addEventListener("mousemove", onMouseMove)
    return () => {
      update.cancel()
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [updateCursor])

  return (
    <div ref={scope} className="absolute inset-0">
      <AnimatePresence>
        {Array.from(cursors.entries()).map(([id, cursor]) => {
          if (!cursor) return null

          const [x, y, press] = cursor

          const style: MotionStyle = {
            x: `${x}%`,
            y: `${y}%`,
          }

          return (
            <motion.div key={id} style={style} data-id={id} className="absolute inset-0">
              <motion.div>
                <motion.div
                  className="w-4 h-4 bg-pink-500"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={variants}
                />
                {id}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
