"use client"

import {
  ComponentProps,
  ForwardedRef,
  MouseEventHandler,
  ReactNode,
  forwardRef,
  useCallback,
} from "react"
import { cx } from "class-variance-authority"

import { useFieldContext } from "./Root"

type Props = Omit<ComponentProps<"label">, "htmlFor"> & {
  children: ReactNode
}

function Label(
  { children, className, onClick, ...props }: Props,
  ref: ForwardedRef<HTMLLabelElement>
) {
  const { name } = useFieldContext()

  const click = useCallback<MouseEventHandler<HTMLLabelElement>>(
    (event) => {
      document.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.focus()
      onClick?.(event)
    },
    [name, onClick]
  )

  return (
    <label
      {...props}
      ref={ref}
      htmlFor={name}
      onClick={click}
      className={cx(
        className,
        "mb-1 flex items-center justify-between px-3.5 font-sans text-sm text-gunpla-white-500"
      )}
    >
      {children}
    </label>
  )
}

export default forwardRef(Label)
