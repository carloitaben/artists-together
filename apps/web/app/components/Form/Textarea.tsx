import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useField } from "remix-validated-form"
import { useFieldContext } from "./Field"
import { cx } from "cva"

type Props = Omit<ComponentProps<"textarea">, "name">

function Textarea(
  { className, rows = 4, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const { name } = useFieldContext()
  const { getInputProps } = useField(name)

  return (
    <textarea
      rows={rows}
      className={cx(className, "resize-y")}
      {...getInputProps({ ...props, id: name })}
      ref={ref}
    />
  )
}

export default forwardRef(Textarea)
