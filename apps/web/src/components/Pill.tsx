import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentPropsWithoutRef, ForwardedRef } from "react"
import { forwardRef } from "react"

export const pill = cva({
  base: "rounded-full shadow-button text-sm items-center justify-center whitespace-nowrap",
  variants: {
    textAlign: {
      false: "",
      center: "text-center",
    },
    color: {
      theme: "bg-theme-50 text-theme-900",
      white: "bg-not-so-white text-not-so-black",
    },
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    gap: {
      false: "",
      sm: "gap-1.5",
      md: "gap-3",
    },
    padding: {
      false: "",
      xs: "py-0.5 px-2",
      sm: "py-0.5 px-3",
      md: "py-1.5 px-5",
    },
  },
  defaultVariants: {
    textAlign: "center",
    color: "theme",
    inline: true,
    gap: "sm",
    padding: "md",
  },
})

type Props = Omit<ComponentPropsWithoutRef<"div">, "color"> &
  Omit<VariantProps<typeof pill>, "icon">

function Pill(
  {
    textAlign,
    color,
    inline,
    padding,
    children,
    gap,
    className,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={pill({
        textAlign,
        color,
        gap,
        inline,
        padding,
        className,
      })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Pill)
