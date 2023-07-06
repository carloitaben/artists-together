"use client"

import { cva, VariantProps } from "class-variance-authority"
import { ComponentProps, ForwardedRef, forwardRef } from "react"

const container = cva(
  "relative overflow-hidden rounded-4xl bg-gunpla-white-50 text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]",
  {
    variants: {
      fill: {
        false: "",
        true: "w-[36rem]",
      },
      padding: {
        false: "",
        true: "px-12 pb-12 pt-10",
      },
    },
    defaultVariants: {
      fill: true,
      padding: true,
    },
  }
)

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Container(
  { fill, padding, className, children, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ fill, padding, className })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Container)
