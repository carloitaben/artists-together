import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback } from "react"
import { useField, useFormContext } from "remix-validated-form"
import { cx } from "cva"
import { useFieldContext } from "./Field"

type Props = Omit<ComponentProps<"input">, "name"> & {
  submitOnBlur?: boolean
}

function Input(
  { className, submitOnBlur, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { defaultValues = {}, submit } = useFormContext()
  const { store, name, controlled } = useFieldContext()
  const { getInputProps } = useField(name)

  const onChange = useCallback<NonNullable<Props["onChange"]>>(
    (event) => {
      store.set(event.target.value)
      props.onChange?.(event)
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
    <input
      className={cx(
        className,
        "bg-not-so-white placeholder-gunpla-white-300 text-gunpla-white-700 caret-gunpla-white-500 rounded-2xl px-3 py-2.5",
      )}
      {...getInputProps({ ...props, id: name })}
      ref={ref}
      onChange={controlled ? onChange : undefined}
      onBlur={onBlur}
    />
  )
}

export default forwardRef(Input)
