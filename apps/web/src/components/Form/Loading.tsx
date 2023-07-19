"use client"

import { AnimatePresence, Variants, motion } from "framer-motion"
import { useFormContext } from "react-hook-form"

const variants: Variants = {
  hide: {
    opacity: 0,
  },
  show: {
    opacity: 0.8,
    transition: {
      delay: 0.1,
    },
  },
}

export default function Loading() {
  const { formState } = useFormContext()

  return (
    <AnimatePresence initial={false}>
      {formState.isLoading ? (
        <motion.div
          className="absolute inset-0 bg-gunpla-white-50"
          initial="hide"
          animate="show"
          exit="hide"
          variants={variants}
        />
      ) : null}
    </AnimatePresence>
  )
}
