import type { VariantProps } from "cva"
import { cva } from "cva"
import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

const title = cva({
  base: "font-serif text-[2rem] leading-normal font-light text-gunpla-white-500",
  variants: {
    padding: {
      true: "px-3",
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = Dialog.DialogTitleProps & VariantProps<typeof title>

function Title(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <Dialog.Title
      {...props}
      ref={ref}
      className={title({
        className,
        padding,
      })}
    />
  )
}

export default forwardRef(Title)
