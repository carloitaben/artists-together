import type { ForwardedRef, ReactNode } from "react"
import { forwardRef } from "react"
import type { HTMLMotionProps } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { useField } from "remix-validated-form"
import { useFieldContext } from "./Field"

type Props = HTMLMotionProps<"div"> & {
  children?: ReactNode | ((error: string) => ReactNode)
}

function Error(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { name } = useFieldContext()
  const { error } = useField(name)

  if (!error) return

  return (
    <AnimatePresence>
      {error ? (
        <motion.div {...props} ref={ref}>
          {typeof children === "function" ? children(error) : children || error}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default forwardRef(Error)
