import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"div">

function Content(
  { className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  return (
    <ark.div
      ref={ref}
      className={cx("absolute inset-0", className)}
      {...props}
    />
  )
}

export default forwardRef(Content)
