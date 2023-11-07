import * as ContextMenu from "@radix-ui/react-context-menu"
import { cx } from "cva"
import type { User } from "lucia"
import { useUser } from "~/hooks/loaders"

type Props = ContextMenu.ContextMenuItemProps & {
  render?: boolean | ((user: User | null) => boolean)
}

export default function Content({ render = true, className, ...props }: Props) {
  const user = useUser()

  if ((typeof render === "function" && !render(user)) || !render) {
    return null
  }

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
