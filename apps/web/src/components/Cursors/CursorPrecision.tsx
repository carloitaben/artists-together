import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { ComponentRef, ForwardedRef } from "react"
import { createContext, forwardRef, useContext } from "react"

type Props = HTMLArkProps<"div"> & {
  name: string
}

export const ATTR_NAME_DATA_CURSOR_PRECISION = "data-precision"

export const ATTR_NAME_DATA_CURSOR_PRECISION_SELECTOR =
  `[${ATTR_NAME_DATA_CURSOR_PRECISION}]` as const

const CursorPrecisionContext = createContext<string | null>(null)

CursorPrecisionContext.displayName = "CursorPrecisionContext"

function CursorPrecision(
  { name, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const scope = useContext(CursorPrecisionContext)
  const scopedName = scope ? `${scope}.${name}` : name
  const attrs = {
    [ATTR_NAME_DATA_CURSOR_PRECISION]: scopedName,
  }

  return (
    <CursorPrecisionContext.Provider value={name}>
      <ark.div ref={ref} {...props} {...attrs} />
    </CursorPrecisionContext.Provider>
  )
}

export default forwardRef(CursorPrecision)
