import { Slot } from "@radix-ui/react-slot"
import { cx } from "cva"
import { forwardRef } from "react"
import type { ComponentProps, ForwardedRef } from "react"

type Props = ComponentProps<"div"> & {
  asChild?: boolean
}

function Root(
  { asChild, className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const Component = asChild ? Slot : "div"

  return (
    <Component {...props} ref={ref} className={cx(className, "inline-block")} />
  )
}

export default forwardRef(Root)
