"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ForwardedRef, forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"

const title = cva("", {
  variants: {
    inset: {
      true: "px-3.5",
      false: "",
    },
  },
  defaultVariants: {
    inset: false,
  },
})

function Title(
  {
    className = "font-serif text-[2rem] font-light text-gunpla-white-500 mb-5",
    inset,
    ...props
  }: DialogPrimitive.DialogTitleProps & VariantProps<typeof title>,
  ref: ForwardedRef<HTMLHeadingElement>
) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      className={title({ inset, className })}
    />
  )
}

export default forwardRef(Title)
