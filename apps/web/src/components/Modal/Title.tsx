import { ForwardedRef, forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import * as DialogPrimitive from "~/components/Dialog"

const title = cva("", {
  variants: {
    padding: {
      x: "px-3.5",
      false: "",
    },
    margin: {
      b: "mb-5",
      false: "",
    },
  },
  defaultVariants: {
    padding: false,
    margin: "b",
  },
})

function Title(
  {
    className = "font-serif text-[2rem] font-light text-gunpla-white-500",
    padding,
    margin,
    ...props
  }: DialogPrimitive.DialogTitleProps & VariantProps<typeof title>,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      className={title({ padding, margin, className })}
    />
  )
}

export default forwardRef(Title)
