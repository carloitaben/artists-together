"use client"

import { AnimatePresence, motion } from "framer-motion"

import { useFieldContext } from "./Field"

export default function Error() {
  const [_, meta] = useFieldContext()

  return (
    <AnimatePresence initial={false}>
      {meta.touched && meta.error && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-3 font-sans text-sm text-acrylic-red-500"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={meta.error}
              className="mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {meta.error}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
