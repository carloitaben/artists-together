"use client"

import type { ReactNode } from "react"
import { useSyncExternalStore } from "react"

function subscribe() {
  return () => {}
}

type Props = {
  fallback?: ReactNode
  children?: ReactNode
}

export default function ClientOnly({
  children = null,
  fallback = null,
}: Props) {
  const render = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  return render ? children : fallback
}
