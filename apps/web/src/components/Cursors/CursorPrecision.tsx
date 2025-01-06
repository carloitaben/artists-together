import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { createContext, useContext } from "react"

type Props = HTMLArkProps<"div"> & {
  name: string
}

export const ATTR_NAME_DATA_CURSOR_PRECISION = "data-precision"

export const ATTR_NAME_DATA_CURSOR_PRECISION_SELECTOR =
  `[${ATTR_NAME_DATA_CURSOR_PRECISION}]` as const

const CursorPrecisionContext = createContext<string | null>(null)

CursorPrecisionContext.displayName = "CursorPrecisionContext"

export default function CursorPrecision({ name, ...props }: Props) {
  const scope = useContext(CursorPrecisionContext)
  const scopedName = scope ? `${scope}.${name}` : name
  const attrs = {
    [ATTR_NAME_DATA_CURSOR_PRECISION]: scopedName,
  }

  return (
    <CursorPrecisionContext.Provider value={name}>
      <ark.div {...props} {...attrs} />
    </CursorPrecisionContext.Provider>
  )
}

