"use client"

import type { ReactNode } from "react"
import { cx } from "class-variance-authority"

import { useFieldContext } from "./Field"
import { FieldHookConfig } from "formik"

type Props = Omit<FieldHookConfig<any>, "name"> & {
  icon?: ReactNode
}

export default function Input({ icon, ...props }: Props) {
  const [field] = useFieldContext(props)

  return (
    <div className="relative">
      <input
        {...props}
        {...field}
        className={cx(
          "w-full rounded-[1rem] bg-not-so-white py-2.5 pl-3.5 font-sans text-sm text-gunpla-white-700 placeholder:text-gunpla-white-300",
          icon ? "pr-10" : "pr-3.5"
        )}
      />
      {icon ? (
        <div className="absolute inset-y-0 right-0 h-10 w-10 p-2 text-gunpla-white-500">
          {icon}
        </div>
      ) : null}
    </div>
  )
}
