"use client"

import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { ComponentRef, ForwardedRef, RefObject } from "react"
import { createContext, forwardRef, useContext, useEffect, useRef } from "react"
import { mergeRefs } from "react-merge-refs"
import { onMeasure } from "~/lib/media"
import {
  ATTR_NAME_DATA_CURSOR_PRECISION,
  SCOPE_ROOT,
  createPrecisionScope,
  measurements,
} from "./lib"

type Props = HTMLArkProps<"div"> & {
  ref?: RefObject<ComponentRef<"div">>
  id: string
}

const CursorPrecisionContext = createContext<string | null>(null)

CursorPrecisionContext.displayName = "CursorPrecisionContext"

function CursorPrecision(
  { id, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const scope = useContext(CursorPrecisionContext)
  const innerRef = useRef<ComponentRef<"div">>(null)

  const attribute = scope
    ? createPrecisionScope(scope, id)
    : createPrecisionScope(SCOPE_ROOT, id)

  const attributes = {
    [ATTR_NAME_DATA_CURSOR_PRECISION]: attribute,
  }

  useEffect(() => {
    const cleanup = onMeasure(innerRef.current, () => {
      measurements.delete(attribute)
    })

    return () => {
      cleanup()
      measurements.delete(attribute)
    }
  }, [attribute])

  return (
    <CursorPrecisionContext.Provider value={id}>
      <ark.div {...props} {...attributes} ref={mergeRefs([ref, innerRef])} />
    </CursorPrecisionContext.Provider>
  )
}

export default forwardRef(CursorPrecision)
