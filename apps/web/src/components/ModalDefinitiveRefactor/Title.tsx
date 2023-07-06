"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

function Title(
  { className, ...props }: DialogPrimitive.DialogTitleProps,
  ref: ForwardedRef<HTMLHeadingElement>
) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      className={cx(
        className || "font-serif text-[2rem] font-light text-gunpla-white-500"
      )}
    />
  )
}

export default forwardRef(Title)
