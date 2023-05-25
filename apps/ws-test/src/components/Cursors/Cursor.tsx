"use client"

import { Cursor } from "ws-types"
import { PerfectCursor } from "perfect-cursors"
import { useRef, useState } from "react"
import { motion, MotionStyle, Variants } from "framer-motion"

import { useWebSocketEvent } from "~/hooks/ws"

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

type Props = {
  cursor: Cursor | null
  id: string
}

export default function Cursor({ cursor, id }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const [pc] = useState(
    () =>
      new PerfectCursor((point) => {
        ref.current?.style.setProperty("transform", `translate(${point[0]}%, ${point[1]}%)`)
      })
  )

  useWebSocketEvent("cursor:update", ([_id, cursor]) => {
    if (_id === id) pc.addPoint([cursor[0], cursor[1]])
  })

  if (!cursor) return null

  const [x, y, press] = cursor

  const style: MotionStyle = {
    x: `${x}%`,
    y: `${y}%`,
  }

  return (
    <motion.div ref={ref} style={style} className="absolute inset-0">
      <motion.div>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          initial="hide"
          animate="show"
          exit="hide"
          variants={variants}
          className=" drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
        >
          <path
            fill="#FAFAFA"
            stroke="#0D0D0D"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.46 29.756a1 1 0 0 0 1.33.484l3.634-1.7a1 1 0 0 0 .482-1.328l-4.137-8.877h7.898a1 1 0 0 0 .617-1.787L8.619 1.882A1 1 0 0 0 7 2.668v24a1 1 0 0 0 1.813.582l4.536-6.34 4.11 8.846Z"
          />
        </motion.svg>
        {id}
      </motion.div>
    </motion.div>
  )
}
