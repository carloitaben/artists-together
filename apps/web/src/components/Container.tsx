import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

export const padding = "px-1 sm:pr-4 sm:pl-0"

const variants = cva({
  base: "w-full mx-auto",
  variants: {
    padding: {
      true: padding,
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = HTMLArkProps<"div"> & VariantProps<typeof variants>

function Container(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  return (
    <ark.div
      ref={ref}
      className={variants({ className, padding })}
      {...props}
    />
  )
}

export default forwardRef(Container)
