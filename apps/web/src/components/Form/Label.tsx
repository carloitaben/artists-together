"use client"

import type { ComponentProps, ReactNode } from "react"
import { cx } from "class-variance-authority"

import { useFieldContext } from "./Field"
import { FieldMetaProps } from "formik"

type Props = ComponentProps<"div"> & {
  children: ReactNode
  icon?: ReactNode
  caption?: ReactNode | ((props: FieldMetaProps<any>) => ReactNode)
}

export default function Label({
  children,
  icon,
  caption,
  className,
  ...props
}: Props) {
  const [field, meta] = useFieldContext()

  function onClick() {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${field.name}"]`
    )

    if (input) input.focus()
  }

  return (
    <div
      {...props}
      className={cx(
        className,
        "mb-1 flex items-center justify-between px-3.5 font-sans text-sm text-gunpla-white-500"
      )}
    >
      <label htmlFor={field.name} onClick={onClick}>
        {children}
      </label>
      <span>{typeof caption === "function" ? caption(meta) : caption}</span>
    </div>
  )
}
