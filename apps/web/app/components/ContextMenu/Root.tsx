import * as ContextMenu from "@radix-ui/react-context-menu"

type Props = ContextMenu.ContextMenuProps

export default function Root(props: Props) {
  return <ContextMenu.Root {...props} />
}
