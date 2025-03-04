import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

const variants = cva({
  base: "rounded-full pressable",
  variants: {
    color: {
      theme:
        "bg-theme-300 text-theme-900 disabled:bg-[red] disabled:text-[green]", // TODO: decide the disabled colors
      white:
        "bg-gunpla-white-50 text-gunpla-white-500 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400",
      false: "",
    },
    gap: {
      true: "",
      false: "",
    },
    icon: {
      true: "size-12 inline-grid place-items-center [&_svg]:size-6",
      false: "inline-flex items-center justify-center h-12",
    },
    padding: {
      true: "",
      false: "",
    },
    shadow: {
      button: "shadow-button",
      false: "",
    },
  },
  defaultVariants: {
    color: "white",
    gap: true,
    icon: false,
    padding: true,
    shadow: "button",
  },
  compoundVariants: [
    {
      icon: false,
      padding: true,
      className: "px-6",
    },
    {
      icon: false,
      padding: false,
      className: "",
    },
    {
      icon: false,
      gap: true,
      className: "gap-2.5",
    },
    {
      icon: false,
      gap: false,
      className: "",
    },
  ],
})

type Props = Omit<HTMLArkProps<"button">, "color"> &
  VariantProps<typeof variants>

function Button(
  { className, color, gap, icon, padding, shadow, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"button">>,
) {
  return (
    <ark.button
      {...props}
      ref={ref}
      className={variants({
        className,
        color,
        gap,
        icon,
        padding,
        shadow,
      })}
    />
  )
}

export default forwardRef(Button)
