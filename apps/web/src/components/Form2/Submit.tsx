"use client"

import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { useFormContext } from "react-hook-form"

import Shiny from "~/components/Shiny"

type Props = ComponentProps<"div">

function Submit(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { formState } = useFormContext()

  const disabled = formState.isLoading || !!Object.keys(formState.errors).length

  return (
    <div {...props}>
      <Shiny>
        <button
          type="submit"
          className="rounded-full bg-gunpla-white-50 px-10 py-3 text-center font-sans text-sm text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] transition active:scale-95 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400 disabled:active:scale-100"
          ref={ref}
          disabled={disabled}
        >
          {children}
        </button>
      </Shiny>
    </div>
  )
}

export default forwardRef(Submit)
