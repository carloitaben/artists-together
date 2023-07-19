"use client"

import { cx } from "class-variance-authority"
import { useFormContext } from "react-hook-form"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { useFieldContext } from "./Field"

type Props = Omit<SwitchPrimitive.SwitchProps, "name">

export default function Switch({ className, ...props }: Props) {
  const { name } = useFieldContext()
  const { register } = useFormContext()

  return (
    <SwitchPrimitive.Root
      {...props}
      {...register(name)}
      className={cx(
        className,
        "group h-8 w-[3.75rem] rounded-full bg-gunpla-white-300 p-1 shadow-inner"
      )}
    >
      <SwitchPrimitive.Thumb className="block h-6 w-6 rounded-full bg-gunpla-white-500 shadow transition group-active:scale-95 group-radix-state-checked:translate-x-[1.75rem] group-radix-state-checked:bg-not-so-white" />
    </SwitchPrimitive.Root>
  )
}
