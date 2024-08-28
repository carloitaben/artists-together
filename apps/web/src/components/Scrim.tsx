import type { HTMLArkProps } from "@ark-ui/react"
import { ark } from "@ark-ui/react"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"

type Props = HTMLArkProps<"div">

function Scrim(
  { className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.div>>,
) {
  return (
    <ark.div
      {...props}
      ref={ref}
      aria-hidden
      className={cx(
        className,
        "fixed inset-0 bg-arpeggio-black-900/75 backdrop-blur-8",
      )}
    />
  )
}

export default forwardRef(Scrim)
