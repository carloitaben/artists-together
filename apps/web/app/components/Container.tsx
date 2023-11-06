import { Slot } from "@radix-ui/react-slot"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { VariantProps } from "cva"
import { cva } from "cva"

export const cols = "grid-cols-4 sm:grid-cols-8"
export const gap = "gap-1 sm:fluid:gap-4"

const container = cva({
  base: "w-full",
  variants: {
    padding: {
      true: "px-1 sm:pr-4 sm:pl-0",
      false: "",
    },
    grid: {
      true: ["grid", cols, gap],
      false: "",
    },
  },
  defaultVariants: {
    grid: false,
    padding: true,
  },
})

type Props = ComponentProps<"div"> &
  VariantProps<typeof container> & {
    asChild?: boolean
  }

function Container(
  { className, children, grid, padding, asChild, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const Component = asChild ? Slot : "div"

  return (
    <Component
      {...props}
      ref={ref}
      className={container({ grid, padding, className })}
    >
      {children}
    </Component>
  )
}

export default forwardRef(Container)
