import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useField, useControlField } from "remix-validated-form"
import type { ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"
import { useFieldContext } from "./Field"

type Props = Omit<SwitchPrimitive.SwitchProps, "name">

function Switch(props: Props, ref: ForwardedRef<HTMLButtonElement>) {
  const { name } = useFieldContext()
  const { validate, getInputProps } = useField(name)
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
      {...props}
      {...getInputProps({
        id: name,
        value: value ? "on" : "off",
        onCheckedChange: onChange,
        className:
          "rounded-full relative bg-gunpla-white-300 cursor-default w-[3.75rem] h-8 p-1 shadow-inner",
      })}
      ref={ref}
    >
      <SwitchPrimitive.Thumb className="block w-6 h-6 bg-gunpla-white-500 rounded-full shadow radix-state-checked:bg-not-so-white radix-state-checked:translate-x-7 translate-x-0 transition-transform ease-out" />
    </SwitchPrimitive.Root>
  )
}

export default forwardRef(Switch)
