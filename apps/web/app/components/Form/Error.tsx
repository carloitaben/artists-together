import type { ForwardedRef, ReactNode } from "react"
import { forwardRef } from "react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { HTMLMotionProps } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { useField } from "remix-validated-form"
import { useFieldContextOrThrow } from "./Field"

const styles = cva({
  base: "",
  variants: {
    padding: {
      true: "px-3",
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = HTMLMotionProps<"div"> &
  VariantProps<typeof styles> & {
    children?: ReactNode | ((error: string) => ReactNode)
  }

function Error(
  { children, className, padding, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { name } = useFieldContextOrThrow()
  const { error } = useField(name)

  if (!error) return

  return (
    <AnimatePresence>
      {error ? (
        <motion.div
          {...props}
          ref={ref}
          className={styles({ className, padding })}
        >
          {typeof children === "function" ? children(error) : children || error}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default forwardRef(Error)
