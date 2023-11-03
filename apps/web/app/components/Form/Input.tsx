import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useField } from "remix-validated-form"
import { useFieldContext } from "./Field"
import { cx } from "cva"

type Props = Omit<ComponentProps<"input">, "name">

function Input(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { name } = useFieldContext()
  const { getInputProps } = useField(name)

  return (
    <input
      className={cx(
        className,
        "bg-not-so-white placeholder-gunpla-white-300 text-gunpla-white-700 caret-theme-300 rounded-2xl p-2.5",
      )}
      {...getInputProps({ ...props, id: name })}
      ref={ref}
    />
  )
}

export default forwardRef(Input)
