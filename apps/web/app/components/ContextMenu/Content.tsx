import * as ContextMenu from "@radix-ui/react-context-menu"
import { cx } from "cva"

type Props = ContextMenu.ContextMenuContentProps

export default function Content({ className, ...props }: Props) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        {...props}
        className={cx(
          className,
          "selection:bg-gunpla-white-300 selection:text-gunpla-white-900",
        )}
      />
    </ContextMenu.Portal>
  )
}
