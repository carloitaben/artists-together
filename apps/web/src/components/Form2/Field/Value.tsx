import { ReactNode } from "react"
import { useWatch } from "react-hook-form"

import { useFieldContext } from "./Root"

type Props = {
  children: (value: any) => ReactNode
}

export default function Value({ children }: Props) {
  const { name } = useFieldContext()
  const value = useWatch({ name })

  return children(value)
}
