import type { ReactNode } from "react"
import { useStore } from "@nanostores/react"
import { useFieldContextOrThrow } from "./Field"

type Props<T> = {
  children: (value?: T) => ReactNode
}

export default function Value<T>({ children }: Props<T>) {
  const { store } = useFieldContextOrThrow()

  const value = useStore(store)

  return children(value as T)
}
