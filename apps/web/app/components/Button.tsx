import { Slot } from "@radix-ui/react-slot"
import { Link, NavLink } from "@remix-run/react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import { Children, forwardRef, isValidElement } from "react"
import type { ComponentProps, ForwardedRef, ReactNode } from "react"
import Icon from "./Icon"

function isIconButton(children: ReactNode) {
  const array = Children.toArray(children)

  if (array.length !== 1) return false

  const child = array[0]

  if (!isValidElement(child)) return false

  switch (child.type) {
    case Link:
    case NavLink:
      return isIconButton(child.props?.children)
    case Icon:
      return true
    default:
      return false
  }
}

const button = cva({
  base: "rounded-full shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] transition active:scale-95 disabled:active:scale-100",
  variants: {
    icon: {
      true: "p-3 w-12 h-12",
      false: "font-sans text-center text-xs sm:text-sm",
    },
    color: {
      white:
        "bg-gunpla-white-50 text-gunpla-white-500 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400",
      theme: "bg-theme-300 text-theme-900 disabled:bg-theme-800",
      false: "",
    },
    flex: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      icon: false,
      flex: true,
      className:
        "inline-flex items-center gap-2.5 py-4 px-[1.125rem] sm:py-3 sm:px-4",
    },
    {
      icon: false,
      flex: false,
      className: "py-3 px-10 inline-block",
    },
  ],
  defaultVariants: {
    color: "white",
    flex: false,
  },
})

type Props = Omit<ComponentProps<"button">, "color"> &
  Omit<VariantProps<typeof button>, "flex" | "icon"> & {
    asChild?: boolean
  }

function Button(
  { asChild, className, color, children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const Component = asChild ? Slot : "button"

  return (
    <Component
      {...props}
      ref={ref}
      className={button({
        className,
        color,
        flex: Children.count(children) > 1,
        icon: isIconButton(children),
      })}
    >
      {children}
    </Component>
  )
}

export default forwardRef(Button)
