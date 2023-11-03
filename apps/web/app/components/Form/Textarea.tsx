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
      className={cx(
        className,
        "resize-none bg-not-so-white placeholder-gunpla-white-300 text-gunpla-white-700 caret-theme-300 rounded-2xl p-2.5",
      )}
      {...getInputProps({ ...props, id: name })}
      ref={ref}
    />
  )
}

export default forwardRef(Textarea)
