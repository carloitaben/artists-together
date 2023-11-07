import * as ContextMenu from "@radix-ui/react-context-menu"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"
import { useContextMenuRootContext } from "./Root"

function Trigger(
  { children, ...props }: ContextMenu.ContextMenuTriggerProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const render = useContextMenuRootContext()

  if (!render) return children

  return (
    <ContextMenu.Trigger {...props} ref={ref}>
      {children}
    </ContextMenu.Trigger>
  )
}

export default forwardRef(Trigger)
