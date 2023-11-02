import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useField, useControlField } from "remix-validated-form"
import type { ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"
import { useFieldContext } from "./Field"

type Props = Omit<SwitchPrimitive.SwitchProps, "name"> // TODO: review this, I think not all props are needed, and if so, they are still not implemented

function Switch(props: Props, ref: ForwardedRef<HTMLButtonElement>) {
  const { name } = useFieldContext()
  const { validate } = useField(name)
  const [value, setValue] = useControlField<boolean>(name)

  const onChange = useCallback(
    (value: boolean) => {
      setValue(value)
      validate()
    },
    [setValue, validate],
  )

  return (
    <SwitchPrimitive.Root
      ref={ref}
      id={name} // TODO: maybe just useField().getInputProps()
      name={name}
      value={value ? "on" : "off"} // TODO: this is not really needed i think
      checked={value}
      onCheckedChange={onChange}
      className="rounded-full relative bg-theme-700 cursor-default w-[3.75rem] h-8 p-1"
    >
      <SwitchPrimitive.Thumb className="block w-6 h-6 bg-gunpla-white-50 rounded-full radix-state-checked:translate-x-7 translate-x-0 transition-transform ease-out" />
    </SwitchPrimitive.Root>
  )
}

export default forwardRef(Switch)
