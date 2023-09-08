"use client"

import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { useFormContext } from "react-hook-form"

import Button from "~/components/Button"

type Props = ComponentProps<"div">

function Submit(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { formState } = useFormContext()
  const disabled = formState.isLoading || !!Object.keys(formState.errors).length

  return (
    <div {...props}>
      <Button type="submit" ref={ref} disabled={disabled}>
        {children}
      </Button>
    </div>
  )
}

export default forwardRef(Submit)
