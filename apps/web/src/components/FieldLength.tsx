import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { useField } from "@conform-to/react"
import { cx } from "cva"

type Props = HTMLArkProps<"span"> & {
  name: string
  max: number
}

export default function FieldLength({ max, name, ...props }: Props) {
  const [field] = useField<string>(name)

  return (
    <ark.span
      {...props}
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
