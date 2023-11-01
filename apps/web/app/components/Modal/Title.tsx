import { cx } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Dialog.DialogTitleProps

function Title(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <Dialog.Title
      {...props}
      ref={ref}
      className={cx(
        className,
        "font-serif text-[2rem] leading-normal font-light text-gunpla-white-500",
      )}
    />
  )
}

export default forwardRef(Title)
