import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useField, useControlField } from "remix-validated-form"
import type { ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"

type Props = {
  name: string
  label: string
}

function Switch({ name, label }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const { error, validate } = useField(name)
  const [value, setValue] = useControlField<boolean>(name)

  const onChange = useCallback(
    (value: boolean) => {
      setValue(value)
      validate()
    },
    [setValue, validate],
  )

  return (
    <div ref={ref}>
      <label htmlFor={name}>{label}</label>
      <SwitchPrimitive.Root
        id={name} // TODO: maybe just useField().getInputProps()
        name={name}
        value={value ? "on" : "off"} // TODO: this is not really needed i think
        checked={value}
        onCheckedChange={onChange}
        className="rounded-full relative bg-theme-700 cursor-default w-[3.75rem] h-8 p-1"
      >
        <SwitchPrimitive.Thumb className="block w-6 h-6 bg-gunpla-white-50 rounded-full radix-state-checked:translate-x-7 translate-x-0 transition-transform ease-out" />
      </SwitchPrimitive.Root>

      {error && <span className="my-error-class">{error}</span>}
    </div>
  )
}

export default forwardRef(Switch)
