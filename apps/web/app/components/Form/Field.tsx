import { Slot } from "@radix-ui/react-slot"
import { forwardRef, createContext, useContext } from "react"
import type { ComponentProps, ForwardedRef, ReactNode } from "react"

type Props = ComponentProps<"div"> & {
  name: string
  children: ReactNode
  asChild?: boolean
}

type Context = Pick<Props, "name">

const context = createContext<Context | null>(null)

context.displayName = "FieldContext"

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
  const Component = asChild ? Slot : "div"

  return (
    <Component {...props} ref={ref}>
      <context.Provider value={{ name }}>{children}</context.Provider>
    </Component>
  )
}

export default forwardRef(Field)
