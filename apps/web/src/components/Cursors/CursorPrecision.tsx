import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { useMotionValueEvent, useScroll } from "motion/react"
import type { ComponentRef, ForwardedRef, RefObject } from "react"
import { createContext, forwardRef, useContext, useEffect, useRef } from "react"
import { mergeRefs } from "react-merge-refs"
import { onMeasure } from "~/lib/media"
import { invalidate } from "./measure"

type Props = HTMLArkProps<"div"> & {
  ref?: RefObject<ComponentRef<"div">>
  name: string
}

export const ATTR_NAME_DATA_CURSOR_PRECISION = "data-precision"

const CursorPrecisionContext = createContext<string | null>(null)

CursorPrecisionContext.displayName = "CursorPrecisionContext"

function CursorPrecision(
  { name, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const scope = useContext(CursorPrecisionContext)
  const innerRef = useRef<ComponentRef<"div">>(null)

  const attr = scope ? `${scope}.${name}` : name
  const attrs = {
    [ATTR_NAME_DATA_CURSOR_PRECISION]: attr,
  }

  const scroll = useScroll()
  useMotionValueEvent(scroll.scrollY, "change", () => invalidate(attr))
  useMotionValueEvent(scroll.scrollX, "change", () => invalidate(attr))

  useEffect(() => {
    const cleanup = onMeasure(innerRef.current, () => invalidate(attr))
    return () => {
      cleanup()
      invalidate(attr)
    }
  }, [attr])

  return (
    <CursorPrecisionContext.Provider value={name}>
      <ark.div {...props} {...attrs} ref={mergeRefs([ref, innerRef])} />
    </CursorPrecisionContext.Provider>
  )
}

export default forwardRef(CursorPrecision)
