import { ark } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = ComponentProps<typeof ark.div>

function ModalContainer(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof ark.div>>,
) {
  return (
    <ark.div
      ref={ref}
      className="rounded-3xl bg-gunpla-white-50 px-12 pb-12 pt-10 text-gunpla-white-500 shadow-card"
      {...props}
    />
  )
}

export default forwardRef(ModalContainer)
