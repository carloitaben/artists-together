import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

const variants = cva({
  base: "block font-fraunces text-[1.5rem]/[1.875rem] font-light md:text-[2rem]/[2.4375rem]",
  variants: {
    padding: {
      x: "px-3.5",
      false: "",
    },
  },
})

type Props = HTMLArkProps<"span"> & VariantProps<typeof variants>

function DialogTitle(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  return (
    <ark.span
      {...props}
      ref={ref}
      className={variants({ className, padding })}
    />
  )
}

export default forwardRef(DialogTitle)
