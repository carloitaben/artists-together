import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useFieldContext } from "./Field"

type Props = Omit<ComponentProps<"label">, "htmlFor">

function Label(props: Props, ref: ForwardedRef<HTMLLabelElement>) {
  const { name } = useFieldContext()

  return <label {...props} htmlFor={name} ref={ref} />
}

export default forwardRef(Label)
