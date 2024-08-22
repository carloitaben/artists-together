import type { HTMLArkProps } from "@ark-ui/react"
import { ark } from "@ark-ui/react"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"

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
