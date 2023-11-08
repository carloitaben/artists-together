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

type Props = ComponentProps<"label"> & VariantProps<typeof label>

function Label(
  { className, padding, htmlFor, ...props }: Props,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const context = useFieldContext()

  if (!context && !htmlFor) {
    throw Error(
      "Either use Form.Label inside a Form.Field or set the htmlFor prop",
    )
  }

  return (
    <label
      className={label({ className, padding })}
      {...props}
      htmlFor={context?.name || htmlFor}
      ref={ref}
    />
  )
}

export default forwardRef(Label)
