import { Slot } from "@radix-ui/react-slot"
import type { VariantProps } from "cva"
import { cva } from "cva"
import { Children, forwardRef } from "react"
import type { ComponentProps, ForwardedRef } from "react"

const button = cva({
  base: "rounded-full py-3 text-center font-sans text-sm shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] transition active:scale-95 disabled:active:scale-100",
  variants: {
    color: {
      white:
        "bg-gunpla-white-50 text-gunpla-white-500 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400",
      false: "",
    },
    flex: {
      true: "inline-flex gap-2.5 px-5",
      false: "px-10",
    },
  },
  defaultVariants: {
    color: "white",
    flex: false,
  },
})

type Props = Omit<ComponentProps<"button">, "color"> &
  Omit<VariantProps<typeof button>, "flex"> & {
    asChild?: boolean
  }

function Button(
  { asChild, className, color, children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const Component = asChild ? Slot : "button"
  const flex = Children.count(children) > 1

  return (
    <Component
      {...props}
      ref={ref}
      className={button({ className, color, flex })}
    >
      {children}
    </Component>
  )
}

export default forwardRef(Button)
