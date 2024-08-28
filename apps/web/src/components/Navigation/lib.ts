import type { Transition, Variants } from "framer-motion"

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
