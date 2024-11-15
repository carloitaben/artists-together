import type { ReactNode } from "react"
import { useHydrated } from "~/lib/react"

type Props = {
  children?: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({
  children = null,
  fallback = children,
}: Props) {
  return useHydrated() ? children : fallback
}
