import { ark } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = ComponentProps<typeof ark.span>

function ModalTitle(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.span>>,
) {
  return (
    <ark.span
      ref={ref}
      className="font-fraunces text-[2rem]/[2.4375rem] font-light"
      {...props}
    />
  )
}

export default forwardRef(ModalTitle)
