import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"
import { useField } from "remix-validated-form"
import { cx } from "cva"
import { useFieldContext } from "./Field"

type Props = Omit<ComponentProps<"textarea">, "name">

function Textarea(
  { className, rows = 4, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const { store, name, controlled } = useFieldContext()
  const { getInputProps } = useField(name)

  const onChange = useCallback<NonNullable<Props["onChange"]>>(
    (event) => {
      store.set(event.target.value)
      props.onChange?.(event)
    },
    [props, store],
  )

  return (
    <textarea
      rows={rows}
      className={cx(
        className,
        "resize-none bg-not-so-white placeholder-gunpla-white-300 text-gunpla-white-700 caret-gunpla-white-500 rounded-2xl px-3 py-2.5 scroll-px-3 scroll-py-2.5",
      )}
      {...getInputProps({ ...props, id: name })}
      ref={ref}
      onChange={controlled ? onChange : undefined}
    />
  )
}

export default forwardRef(Textarea)
