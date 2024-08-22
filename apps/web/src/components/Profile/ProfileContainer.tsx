import type { HTMLArkProps } from "@ark-ui/react"
import { ark } from "@ark-ui/react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { Section } from "./lib"

const padding = {
  x: "px-12",
  y: "pt-10 pb-12",
}

const variants = cva({
  base: "rounded-6 bg-gunpla-white-50 text-gunpla-white-500 shadow-card",
  variants: {
    padding: {
      x: padding.x,
      y: padding.y,
      true: [padding.x, padding.y],
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = HTMLArkProps<"div"> &
  VariantProps<typeof variants> & {
    section: Section
  }

export default function ProfileContainer({
  className,
  section,
  padding,
  ...props
}: Props) {
  return (
    <ark.div
      id={section}
      className={variants({ className, padding })}
      {...props}
    />
  )
}
