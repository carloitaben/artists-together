"use client"

import type { ComponentProps, ReactNode } from "react"
import { cx } from "class-variance-authority"

import { useFieldContext } from "./Field"

type Props = ComponentProps<"div"> & {
  children: ReactNode
  icon?: ReactNode
  caption?: string | ((props: { value: string }) => string)
}

export default function Label({
  children,
  icon,
  caption,
  className,
  ...props
}: Props) {
  const [field] = useFieldContext()

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
        "mb-1 flex items-center justify-between px-3 font-sans text-sm text-gunpla-white-500"
      )}
    >
      <label htmlFor={field.name} onClick={onClick}>
        {children}
      </label>
      <span>
        {typeof caption === "function"
          ? caption({ value: field.value })
          : caption}
      </span>
    </div>
  )
}
