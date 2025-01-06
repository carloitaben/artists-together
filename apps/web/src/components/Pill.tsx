import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"

const variants = cva({
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

type Props = Omit<HTMLArkProps<"div">, "color"> & VariantProps<typeof variants>

export default function Pill({
  textAlign,
  color,
  inline,
  gap,
  padding,
  className,
  ...props
}: Props) {
  return (
    <ark.div
      {...props}
      className={variants({
        textAlign,
        color,
        gap,
        inline,
        padding,
        className,
      })}
    />
  )
}
