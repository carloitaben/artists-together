"use client"

import { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { cx } from "class-variance-authority"

import { useFieldContext } from "./Root"

type Props = Pick<ComponentProps<"div">, "className">

export default function Error({ className }: Props) {
  const { name } = useFieldContext()
  const { formState } = useFormContext()

  const error =
    name in formState.errors
      ? formState.errors[name]?.message?.toString() || "Unknown error"
      : null

  return (
    <AnimatePresence initial={false}>
      {name in formState.errors ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cx(
            className,
            "px-3 font-sans text-sm text-acrylic-red-500"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={error}
              className="mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
