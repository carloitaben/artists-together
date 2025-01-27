"use client"

import { animate } from "motion/react"
import type { PropsWithChildren } from "react"
import { TransitionRouter } from "~/lib/transition"

export default function PageTransition({ children }: PropsWithChildren) {
  return (
    <TransitionRouter
      leave={async () => {
        await animate(
          "[data-transition-container]",
          { opacity: 0 },
          { duration: 0.125 },
        )
      }}
      enter={async () => {
        await animate(
          "[data-transition-container]",
          { opacity: 1 },
          { duration: 0.125 },
        )
      }}
    >
      {children}
    </TransitionRouter>
  )
}
