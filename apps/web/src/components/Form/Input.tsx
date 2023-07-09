"use client"

import type { ReactNode } from "react"
import { cx } from "class-variance-authority"
import { FieldHookConfig } from "formik"

import Shiny from "~/components/Shiny"

import { useFieldContext } from "./Field"

type Props = Omit<FieldHookConfig<any>, "name"> & {
  icon?: ReactNode
}

export default function Input({ icon, ...props }: Props) {
  const [field] = useFieldContext(props)

  return (
    <Shiny>
      <div className="relative rounded-[1rem]">
        {/* @ts-expect-error I don't really know why this happens */}
        <input
          {...props}
          {...field}
          className={cx(
            "w-full rounded-[1rem] bg-not-so-white py-2.5 pl-3.5 font-sans text-sm text-gunpla-white-700 caret-gunpla-white-700 placeholder:text-gunpla-white-300",
            icon ? "pr-10" : "pr-3.5"
          )}
        />
        {icon ? (
          <div className="absolute inset-y-0 right-0 h-10 w-10 p-2 text-gunpla-white-500">
            {icon}
          </div>
        ) : null}
      </div>
    </Shiny>
  )
}
