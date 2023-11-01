import { cx } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Dialog.DialogOverlayProps

function Overlay(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Dialog.Overlay
      {...props}
      ref={ref}
      className={cx(
        className,
        "fixed inset-0 flex items-center justify-center bg-theme-900/25 backdrop-blur-xl overflow-y-auto",
      )}
    />
  )
}

export default forwardRef(Overlay)