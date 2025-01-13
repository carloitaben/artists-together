import type { CursorState } from "@artists-together/core/websocket"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { Variants } from "motion/react"
import { motion } from "motion/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"
import Pill from "~/components/Pill"

const variants = cva({
  base: "pointer-events-none inset-0 size-full select-none",
  variants: {
    position: {
      absolute: "absolute",
      fixed: "fixed",
    },
  },
})

type Props = ComponentProps<typeof motion.div> &
  VariantProps<typeof variants> & {
    state: CursorState
    username?: string
  }

const motionVariants: Variants = {
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

function Cursor(
  {
    state,
    username,
    className,
    position,
    style: { scale, ...style } = {},
    ...props
  }: Props,
  ref: ForwardedRef<ComponentRef<typeof motion.div>>,
) {
  return (
    <motion.div
      {...props}
      aria-hidden
      className={variants({ className, position })}
      initial="hide"
      animate={["show", state]}
      exit="hide"
      ref={ref}
      style={style}
    >
      <motion.div
        className="inline-flex items-start"
        variants={motionVariants}
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

export default forwardRef(Cursor)