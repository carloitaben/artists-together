import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"span">

function DialogTitle(
  { className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  return (
    <ark.span
      {...props}
      ref={ref}
      className={cx(
        "block px-3.5 font-fraunces text-[2rem]/[2.4375rem] font-light",
        className,
      )}
    />
  )
}

export default forwardRef(DialogTitle)
