"use client"

import { useFormikContext } from "formik"
import { AnimatePresence, Variants, motion } from "framer-motion"

const variants: Variants = {
  hide: {
    opacity: 0,
  },
  show: {
    opacity: 0.8,
  },
}

export default function Loading() {
  const { isSubmitting } = useFormikContext()

  return (
    <AnimatePresence initial={false}>
      {isSubmitting ? (
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
