import type { VariantProps } from "cva"
import { cva } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

const content = cva({
  base: "flex flex-col gap-y-2 [&>*:last-child]:mt-2 selection:bg-gunpla-white-300 selection:text-gunpla-white-900 focus:outline-none",
  variants: {
    fill: {
      true: "w-full max-w-xl",
      false: "",
    },
  },
  defaultVariants: {
    fill: true,
  },
})

type Props = Dialog.DialogContentProps & VariantProps<typeof content>

function Content(
  { className, fill, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Dialog.Content
      {...props}
      ref={ref}
      className={content({ className, fill })}
    />
  )
}

export default forwardRef(Content)
