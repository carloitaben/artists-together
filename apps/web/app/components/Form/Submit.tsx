import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import type { ComponentProps, ForwardedRef } from "react"
import { useIsSubmitting } from "remix-validated-form"

type Props = ComponentProps<"button"> & {
  asChild?: boolean
}

function Submit(
  { type = "submit", disabled, asChild, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const isSubmitting = useIsSubmitting()

  const Component = asChild ? Slot : "button"

  return (
    <Component
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || isSubmitting}
    />
  )
}

export default forwardRef(Submit)
