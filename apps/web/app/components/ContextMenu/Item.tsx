import * as ContextMenu from "@radix-ui/react-context-menu"
import { cx } from "cva"

type Props = ContextMenu.ContextMenuItemProps & {
  auth?: boolean
}

export default function Content({ auth, className, ...props }: Props) {
  return (
    <ContextMenu.Item
      {...props}
      className={cx(
        className,
        "first:rounded-t-3xl rounded-lg last:rounded-b-3xl bg-gunpla-white-50 text-gunpla-white-500 py-3.5 px-6 my-0.5 shadow-button cursor-pointer radix-disabled:cursor-default radix-disabled:bg-gunpla-white-100 radix-disabled:text-gunpla-white-400 min-w-[14.375rem] w-full",
      )}
    />
  )
}
