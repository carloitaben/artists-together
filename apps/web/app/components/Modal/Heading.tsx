import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"

const heading = cva({
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

type Props = ComponentProps<"h3"> & VariantProps<typeof heading>

function Heading(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <h3
      {...props}
      ref={ref}
      className={heading({
        className,
        padding,
      })}
    />
  )
}

export default forwardRef(Heading)