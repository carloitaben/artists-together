import type { ReactNode } from "react"
import { useStore } from "@nanostores/react"
import { useFieldContext } from "./Field"

type Props<T> = {
  children: (value?: T) => ReactNode
}

export default function Value<T>({ children }: Props<T>) {
  const { store } = useFieldContext()

  const value = useStore(store)

  return children(value as T)
}
