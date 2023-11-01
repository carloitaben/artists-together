import { cx } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Dialog.DialogContentProps

function Content(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return <Dialog.Content {...props} ref={ref} className={cx(className, "")} />
}

export default forwardRef(Content)
