import { Switch } from "@ark-ui/react/switch"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = ComponentProps<typeof Switch.Control>

function SwitchControl(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof Switch.Control>>,
) {
  return (
    <Switch.Control
      ref={ref}
      className="h-8 w-[3.75rem] rounded-full bg-gunpla-white-300 p-1 shadow-inner"
      {...props}
    >
      <Switch.Thumb className="inline-block size-6 rounded-full bg-gunpla-white-500 shadow transition data-[state='checked']:translate-x-7 data-[state='checked']:bg-not-so-white" />
    </Switch.Control>
  )
}

export default forwardRef(SwitchControl)
