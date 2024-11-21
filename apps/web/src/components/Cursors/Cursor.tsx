import type { CursorState } from "@artists-together/core/websocket"
import type { MotionValue, Variants } from "motion/react"
import { motion } from "motion/react"
import Icon from "~/components/Icon"
import Pill from "~/components/Pill"

type Props = {
  state: CursorState
  x: MotionValue
  y: MotionValue
  scale?: MotionValue
  username?: string
}

const variants: Variants = {
  hide: {
    scale: 0,
    transition: {
      type: "spring",
      mass: 0.15,
      stiffness: 200,
    },
  },
  show: {
    scale: 1,
    transition: {
      type: "spring",
      mass: 0.05,
      stiffness: 200,
    },
  },
}

export default function Cursor({ state, username, scale, x, y }: Props) {
  return (
    <motion.div
      className="absolute inset-0 size-full"
      initial="hide"
      animate={["show", state]}
      exit="hide"
      style={{ x, y }}
    >
      <motion.div
        className="inline-flex items-start"
        variants={variants}
        style={{ scale }}
      >
        <Icon src="CursorIdle" alt="" className="size-8 drop-shadow-cursor" />
        {username ? (
          <Pill
            color="white"
            className="-translate-x-1 -translate-y-3"
            padding="xs"
          >
            {username}
          </Pill>
        ) : null}
      </motion.div>
    </motion.div>
  )
}
