import type {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  ReactElement,
} from "react"
import { cloneElement, createContext, forwardRef, useContext } from "react"

type Props = Omit<ComponentProps<"div">, "children"> & {
  name: string
  children: ReactElement
}

export const ATTR_NAME_DATA_CURSOR_PRECISION = "data-precision"

export const ATTR_NAME_DATA_CURSOR_PRECISION_SELECTOR =
  `[${ATTR_NAME_DATA_CURSOR_PRECISION}]` as const

const CursorPrecisionContext = createContext<string | null>(null)

CursorPrecisionContext.displayName = "CursorPrecisionContext"

function CursorPrecision(
  { name, children, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const scope = useContext(CursorPrecisionContext)
  const scopedName = scope ? `${scope}.${name}` : name

  return (
    <CursorPrecisionContext.Provider value={name}>
      {cloneElement(
        children,
        Object.assign(props, {
          ref,
          [ATTR_NAME_DATA_CURSOR_PRECISION]: scopedName,
        }),
      )}
    </CursorPrecisionContext.Provider>
  )
}

export default forwardRef(CursorPrecision)
