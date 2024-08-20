import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import Slot from "./Slot"

export const cols = "grid-cols-4 sm:grid-cols-8"

export const gap = {
  x: "gap-x-1 sm:scale:gap-x-4",
  y: "gap-y-1 sm:scale:gap-y-4",
}

const container = cva({
  base: "w-full",
  variants: {
    padding: {
      true: "px-1 sm:pr-4 sm:pl-0",
      false: "",
    },
    grid: {
      true: ["grid", cols, gap.x, gap.y],
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
