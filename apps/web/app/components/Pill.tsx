import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentProps, ForwardedRef, ReactElement } from "react"
import { forwardRef } from "react"

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
  Omit<VariantProps<typeof pill>, "icon"> & {
    icon?: ReactElement<ComponentProps<"svg">>
  }

function Pill(
  { color, inline, icon, size, children, className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={pill({ color, inline, icon: !!icon, size, className })}
    >
      {icon ? <span className="h-4 w-4 flex-none">{icon}</span> : null}
      {children}
    </div>
  )
}

export default forwardRef(Pill)
