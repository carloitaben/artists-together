import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"
import Slot from "~/components/Slot"

type Props = ComponentProps<"div"> & {
  ratio: number
  asChild?: boolean
}

function Root(
  { asChild, className, ratio, style = {}, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const Component = asChild ? Slot : "div"

  return (
    <Component
      {...props}
      className={cx("relative w-full", className)}
      style={{ ...style, paddingBottom: `${100 / ratio}%` }}
      ref={ref}
    />
  )
}

export default forwardRef(Root)
