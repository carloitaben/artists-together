import { cx } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Dialog.DialogContentProps

function Content(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Dialog.Content
      {...props}
      ref={ref}
      className={cx(className, "flex flex-col gap-y-2 [&>*:last-child]:mt-2")}
    />
  )
}

export default forwardRef(Content)
