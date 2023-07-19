"use client"

import { ComponentProps, ForwardedRef, ReactNode, createContext, forwardRef, useContext } from "react"

type Context = {
  name: string
}

const context = createContext<Context | null>(null)

export function useFieldContext() {
  const value = useContext(context)

  if (!value) {
    throw Error("Called useFieldContext() outside Field component")
  }

  return value
}

type Props = ComponentProps<"div"> & {
  children: ReactNode
  name: string
}

function Root({ children, name, ...props }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const value: Context = {
    name,
  }

  return (
    <div {...props} ref={ref}>
      <context.Provider value={value}>{children}</context.Provider>
    </div>
  )
}

export default forwardRef(Root)
