import type { Transition, Variants } from "motion/react"

export const spring: Transition = {
  type: "spring",
  bounce: 0.275,
}

export const scalePresenceVariants: Variants = {
  hide: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
  },
}
