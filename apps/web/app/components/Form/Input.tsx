import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useField } from "remix-validated-form"
import { useFieldContext } from "./Field"

type Props = Omit<ComponentProps<"input">, "name">

function Input(props: Props, ref: ForwardedRef<HTMLInputElement>) {
  const { name } = useFieldContext()
  const { getInputProps } = useField(name)

  return <input {...getInputProps({ ...props, id: name })} ref={ref} />
}

export default forwardRef(Input)
