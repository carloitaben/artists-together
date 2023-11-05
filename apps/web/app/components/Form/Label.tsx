import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { VariantProps } from "cva"
import { cva } from "cva"
import { useFieldContext } from "./Field"

const label = cva({
  base: "min-h-[1.875rem] flex items-center",
  variants: {
    padding: {
      true: "px-3",
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = Omit<ComponentProps<"label">, "htmlFor"> &
  VariantProps<typeof label>

function Label(
  { className, padding, ...props }: Props,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { name } = useFieldContext()

  return (
    <label
      className={label({ className, padding })}
      {...props}
      htmlFor={name}
      ref={ref}
    />
  )
}

export default forwardRef(Label)
