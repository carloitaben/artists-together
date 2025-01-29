import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

const variants = cva({
  base: "block md:text-[2rem]/[2.4375rem]",
  variants: {
    sm: {
      inter:
        "font-sans text-[0.875rem]/[1.0625rem] md:font-fraunces md:font-light",
      fraunces: "font-fraunces text-[1.5rem]/[1.875rem] font-light ",
    },
  },
})

type Props = HTMLArkProps<"span"> & Required<VariantProps<typeof variants>>

function DialogTitle(
  { className, sm, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  return (
    <ark.span {...props} ref={ref} className={variants({ className, sm })} />
  )
}

export default forwardRef(DialogTitle)
