"use client"

import {
  ComponentProps,
  ForwardedRef,
  MouseEventHandler,
  ReactNode,
  forwardRef,
  useCallback,
} from "react"
import { cva, VariantProps } from "class-variance-authority"

import { useFieldContext } from "./Field"

const label = cva("font-sans text-sm text-gunpla-white-500", {
  variants: {
    flex: {
      true: "flex items-center justify-between",
      false: "",
    },
    padding: {
      true: "px-3.5",
      false: "",
    },
    margin: {
      true: "mb-1",
      false: "",
    },
  },
  defaultVariants: {
    flex: true,
    margin: true,
    padding: true,
  },
})

type Props = Omit<ComponentProps<"label">, "htmlFor"> &
  VariantProps<typeof label> & {
    children: ReactNode
  }

function Label(
  { children, className, onClick, margin, padding, flex, ...props }: Props,
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
      className={label({ margin, padding, flex, className })}
    >
      {children}
    </label>
  )
}

export default forwardRef(Label)
