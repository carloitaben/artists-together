import type { HTMLArkProps } from "@ark-ui/react"
import { ark } from "@ark-ui/react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

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

type Props = HTMLArkProps<"div"> & VariantProps<typeof variants>

function DialogContainer(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.div>>,
) {
  return (
    <ark.div
      {...props}
      ref={ref}
      className={variants({ className, padding })}
    />
  )
}

export default forwardRef(DialogContainer)
