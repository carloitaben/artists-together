import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"
import Slot from "~/components/Slot"

type Props = ComponentProps<"div"> & {
  asChild?: boolean
}

function Content(
  { className, asChild, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const Component = asChild ? Slot : "div"

  return (
    <Component
      {...props}
      ref={ref}
      className={cx("absolute inset-0", className)}
    />
  )
}

export default forwardRef(Content)
