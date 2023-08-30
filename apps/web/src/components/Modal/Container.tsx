import { cva, VariantProps } from "class-variance-authority"
import { ComponentProps, ForwardedRef, forwardRef } from "react"

const container = cva(
  "relative overflow-hidden rounded-4xl shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]",
  {
    variants: {
      background: {
        false: "",
        true: "bg-gunpla-white-50 text-gunpla-white-500",
      },
      fill: {
        false: "",
        true: "w-[36rem]",
      },
      px: {
        false: "",
        true: "px-12",
      },
      py: {
        false: "",
        true: "pb-12 pt-10",
      },
    },
    defaultVariants: {
      fill: true,
      px: true,
      py: true,
      background: true,
    },
  },
)

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Container(
  { fill, px, py, className, children, background, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ fill, px, py, className, background })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Container)
