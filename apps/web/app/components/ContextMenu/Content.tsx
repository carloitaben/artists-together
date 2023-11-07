import * as ContextMenu from "@radix-ui/react-context-menu"
import { cx } from "cva"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"
import { useContextMenuRootContext } from "./Root"

type Props = ContextMenu.ContextMenuContentProps

function Content(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const render = useContextMenuRootContext()

  if (!render) return null

  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        {...props}
        ref={ref}
        className={cx(
          className,
          "selection:bg-gunpla-white-300 selection:text-gunpla-white-900",
        )}
      />
    </ContextMenu.Portal>
  )
}

export default forwardRef(Content)