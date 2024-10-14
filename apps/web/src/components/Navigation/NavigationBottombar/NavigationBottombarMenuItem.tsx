import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

const variants = cva({
  base: [
    "flex h-12 items-center rounded-4 py-3 gap-5 min-w-44 text-gunpla-white-50 bg-arpeggio-black-900 [&_svg]:size-6 [&_svg]:flex-none",
    "aria-[current='page']:text-arpeggio-black-900 aria-[current='page']:bg-arpeggio-black-300",
  ],
  variants: {
    justify: {
      start: "justify-start pl-3 pr-4",
      between: "justify-between pl-4 pr-3",
    },
    disabled: {
      true: "cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
    justify: "start",
  },
})

type Props = HTMLArkProps<"div"> & VariantProps<typeof variants>

function BottombarMenuItem(
  { className, disabled, justify, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.div>>,
) {
  return (
    <ark.div
      {...props}
      ref={ref}
      className={variants({ className, justify, disabled })}
    />
  )
}

export default forwardRef(BottombarMenuItem)
