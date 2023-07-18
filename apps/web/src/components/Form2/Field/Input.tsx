"use client"

import { ComponentProps, ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { cx } from "class-variance-authority"

import Shiny from "~/components/Shiny"

import { useFieldContext } from "./Root"

type Props = Omit<ComponentProps<"input">, "name" | "id"> & {
  icon?: ReactNode
}

export default function Input({ className, icon, ...props }: Props) {
  const { name } = useFieldContext()
  const { formState, register } = useFormContext()

  return (
    <Shiny>
      <div className="relative rounded-[1rem]">
        <input
          {...props}
          {...register(name)}
          id={name}
          aria-invalid={name in formState.errors ? "true" : "false"}
          className={cx(
            className,
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
