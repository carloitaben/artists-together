import * as ContextMenu from "@radix-ui/react-context-menu"
import type { User } from "lucia"
import { createContext, useContext } from "react"
import { useUser } from "~/hooks/loaders"

type Props = ContextMenu.ContextMenuProps & {
  render?: boolean | ((user: User | null) => boolean)
}

export const context = createContext<boolean | null>(null)

context.displayName = "ContextMenuRootContext"

export function useContextMenuRootContext() {
  const value = useContext(context)

  if (typeof value !== "boolean") {
    throw Error("Called context menu root context outside provider")
  }

  return value
}

export default function Root({ render = true, children, ...props }: Props) {
  const user = useUser()

  const shouldRender = typeof render === "function" ? render(user) : render

  const child = (
    <context.Provider value={shouldRender}>{children}</context.Provider>
  )

  if (!shouldRender) return child

  return <ContextMenu.Root {...props}>{child}</ContextMenu.Root>
}
