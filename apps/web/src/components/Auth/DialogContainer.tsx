import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"div">

function DialogContainer(
  { className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.div>>,
) {
  return (
    <ark.div
      {...props}
      ref={ref}
      className={cx(
        "rounded-4 bg-gunpla-white-50 text-gunpla-white-500 shadow-card md:rounded-6",
        className,
      )}
    />
  )
}

export default forwardRef(DialogContainer)
