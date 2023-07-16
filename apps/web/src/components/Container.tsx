import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"

export const cols = "grid-cols-4 sm:grid-cols-8"
export const gap = "fluid:gap-4"

const container = cva("w-full", {
  variants: {
    padding: {
      left: "pl-4 sm:pl-0",
      right: "pr-4",
      both: "px-4 sm:pl-0",
      none: "",
    },
    grid: {
      true: ["grid", cols, gap],
      false: "",
    },
  },
  defaultVariants: {
    grid: false,
    padding: "both",
  },
})

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Container(
  { className, children, grid, padding, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ grid, padding, className })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Container)
