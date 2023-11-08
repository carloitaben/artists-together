import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"
import { useField, useFormContext } from "remix-validated-form"
import { cx } from "cva"
import { useFieldContextOrThrow } from "./Field"

type Props = Omit<ComponentProps<"textarea">, "name"> & {
  submitOnBlur?: boolean
}

function Textarea(
  { className, submitOnBlur, rows = 4, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const { defaultValues = {}, submit } = useFormContext()
  const { store, name, controlled } = useFieldContextOrThrow()
  const { getInputProps } = useField(name)

  const onChange = useCallback<NonNullable<Props["onChange"]>>(
    (event) => {
      props.onChange?.(event)
      store.set(event.target.value)
    },
    [props, store],
  )

  const onBlur = useCallback<NonNullable<Props["onBlur"]>>(
    (event) => {
      props.onBlur?.(event)

      if (
        submitOnBlur &&
        name in defaultValues &&
        defaultValues[name] !== event.target.value
      ) {
        submit()
      }
    },
    [defaultValues, name, props, submit, submitOnBlur],
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
      onBlur={onBlur}
    />
  )
}

export default forwardRef(Textarea)
