import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentProps, ForwardedRef, ReactNode } from "react"
import { Children, forwardRef, isValidElement } from "react"
import Icon from "./Icon"

function hasIcon(children: ReactNode) {
  const array = Children.toArray(children)

  if (array.length !== 1) return false

  const child = array[0]

  if (!isValidElement(child)) return false

  return child.type === Icon
}

const pill = cva({
  base: "rounded-full shadow-button gap-1.5 text-sm text-center items-center justify-center whitespace-nowrap",
  variants: {
    color: {
      theme: "bg-theme-50 text-theme-900",
      white: "bg-not-so-white text-not-so-black",
    },
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    size: {
      sm: "py-0.5 px-3",
      md: "py-1.5 px-5",
    },
    icon: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    color: "theme",
    inline: true,
    icon: false,
    size: "md",
  },
})

type Props = Omit<ComponentProps<"div">, "color"> &
  Omit<VariantProps<typeof pill>, "icon">

function Pill(
  { color, inline, size, children, className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={pill({
        color,
        inline,
        icon: hasIcon(children),
        size,
        className,
      })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Pill)
