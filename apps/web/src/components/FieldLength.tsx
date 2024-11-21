import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { useField } from "@conform-to/react"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"span"> & {
  name: string
  max: number
}

function FieldLength(
  { max, name, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  const [field] = useField<string>(name)

  return (
    <ark.span
      {...props}
      ref={ref}
      className={cx(
        props.className,
        "tabular-nums tracking-tight",
        field.value && field.value.length > max && "text-acrylic-red-500",
      )}
    >
      {field.value?.length || 0}/{max}
    </ark.span>
  )
}

export default forwardRef(FieldLength)
