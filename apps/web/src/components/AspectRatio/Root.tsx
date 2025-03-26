import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"div"> & {
  ratio: number
}

function Root(
  { className, ratio, style, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  return (
    <ark.div
      ref={ref}
      className={cx("relative w-full", className)}
      style={{ ...style, paddingBottom: `${100 / ratio}%` }}
      {...props}
    />
  )
}

export default forwardRef(Root)
