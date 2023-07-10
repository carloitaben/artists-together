import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"

export const cols = "grid-cols-4 sm:grid-cols-8"
export const gap = "gap-4"

const container = cva("w-full px-4 sm:pl-0", {
  variants: {
    grid: {
      true: ["grid", cols, gap],
      false: "",
    },
  },
  defaultVariants: {
    grid: false,
  },
})

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Container(
  { className, children, grid, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div {...props} ref={ref} className={container({ grid, className })}>
      {children}
    </div>
  )
}

export default forwardRef(Container)
