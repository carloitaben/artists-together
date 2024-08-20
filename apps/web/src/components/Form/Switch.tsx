import { Switch as SwitchPrimitive } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"

type Props = ComponentProps<typeof SwitchPrimitive.Root>

function Switch(
  { children, className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof SwitchPrimitive.Root>>,
) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cx(className, "flex items-center justify-between")}
      {...props}
    >
      <SwitchPrimitive.Label>{children}</SwitchPrimitive.Label>
      <SwitchPrimitive.Control className="relative h-8 w-[3.75rem] rounded-full bg-gunpla-white-300 p-1 shadow-inner">
        <SwitchPrimitive.Thumb className="block size-6 translate-x-0 rounded-full bg-gunpla-white-500 shadow transition duration-100 ease-out data-[state='checked']:translate-x-7 data-[state='checked']:bg-not-so-white" />
      </SwitchPrimitive.Control>
      <SwitchPrimitive.HiddenInput />
    </SwitchPrimitive.Root>
  )
}

export default forwardRef(Switch)
