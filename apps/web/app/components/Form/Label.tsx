import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useFieldContext } from "./Field"
import { cx } from "cva"

type Props = Omit<ComponentProps<"label">, "htmlFor">

function Label(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { name } = useFieldContext()

  return (
    <label
      className={cx(className, "min-h-[1.875rem] flex items-center")}
      {...props}
      htmlFor={name}
      ref={ref}
    />
  )
}

export default forwardRef(Label)
