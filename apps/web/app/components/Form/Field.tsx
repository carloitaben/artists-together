import { Slot } from "@radix-ui/react-slot"
import type { WritableAtom } from "nanostores"
import { atom } from "nanostores"
import { forwardRef, createContext, useContext, useState } from "react"
import type { ComponentProps, ForwardedRef, ReactNode } from "react"
import { useField } from "remix-validated-form"
import { findComponent } from "~/lib/react"
import { Value } from "."

type Props = ComponentProps<"div"> & {
  name: string
  children: ReactNode
  asChild?: boolean
}

type Context = Pick<Props, "name"> & {
  controlled: boolean
  store: WritableAtom<unknown>
}

const context = createContext<Context | null>(null)

context.displayName = "FormFieldContext"

export function useFieldContext() {
  const value = useContext(context)

  if (!value) {
    throw Error("Called field context outside provider")
  }

  return value
}

function Field(
  { children, asChild, name, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { defaultValue } = useField(name)
  const [controlled] = useState(() => !!findComponent(children, Value))
  const [store] = useState(() => atom<unknown>(defaultValue))

  const Component = asChild ? Slot : "div"

  return (
    <Component {...props} ref={ref}>
      <context.Provider value={{ name, store, controlled }}>
        {children}
      </context.Provider>
    </Component>
  )
}

export default forwardRef(Field)
