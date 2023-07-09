"use client"

import { FieldHookConfig, useField } from "formik"
import { ComponentProps, ReactNode, createContext, useContext } from "react"

type FieldContext = {
  name: string
}

export const fieldContext = createContext<FieldContext | null>(null)

export function useFieldContext<T = any>(
  props?: Omit<FieldHookConfig<T>, "name">
) {
  const value = useContext(fieldContext)

  if (!value) {
    throw Error("Called useFieldContext outside of Field component")
  }

  return useField(
    props ? ({ ...props, name: value.name } as FieldHookConfig<T>) : value.name
  )
}

type Props = ComponentProps<"div"> & {
  children: ReactNode
  name: string
}

export default function Field({ name, children, ...props }: Props) {
  const value: FieldContext = {
    name,
  }

  return (
    <div {...props}>
      <fieldContext.Provider value={value}>{children}</fieldContext.Provider>
    </div>
  )
}
