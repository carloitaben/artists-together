import type { ComponentProps } from "react"
import { useIsSubmitting } from "remix-validated-form"

type Props = ComponentProps<"button">

export default function Submit({ type = "submit", disabled, ...props }: Props) {
  const isSubmitting = useIsSubmitting()
  return <button {...props} type={type} disabled={disabled || isSubmitting} />
}
