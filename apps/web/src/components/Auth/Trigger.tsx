import { Dialog } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = ComponentProps<typeof Dialog.Trigger>

function Trigger(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof Dialog.Trigger>>,
) {
  return <Dialog.Trigger ref={ref} {...props} />
}

export default forwardRef(Trigger)
