import type { VariantProps } from "cva"
import { cva } from "cva"
import { forwardRef } from "react"
import type { ComponentProps, ForwardedRef } from "react"

const container = cva({
  base: "rounded-4xl shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]",
  variants: {
    background: {
      true: "bg-gunpla-white-50 text-gunpla-white-500",
      false: "",
    },
    fill: {
      true: "w-full max-w-xl",
      false: "",
    },
  },
  defaultVariants: {
    fill: true,
    background: true,
  },
})

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Content(
  { className, fill, background, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ className, fill, background })}
    />
  )
}

export default forwardRef(Content)
