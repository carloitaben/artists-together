"use client"

import type { ReactNode } from "react"
import { useHydrated } from "~/lib/react/client"

type Props = {
  fallback?: ReactNode
  children?: ReactNode
}

export default function ClientOnly({
  children = null,
  fallback = null,
}: Props) {
  return useHydrated() ? children : fallback
}
