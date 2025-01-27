"use client"

import type { User } from "@artists-together/core/database"
import type { PropsWithChildren } from "react"
import type { getHints } from "~/services/hints/server"
import { createRequiredContext } from "./react"

type Promises = {
  hints: Awaited<ReturnType<typeof getHints>>
  user: User | null
}

const [PromiseContext, usePromiseContext] =
  createRequiredContext<Promises>("PromiseContext")

export function PromiseProvider({
  children,
  ...value
}: PropsWithChildren<Promises>) {
  return <PromiseContext value={value}>{children}</PromiseContext>
}

export function useUser() {
  return usePromiseContext().user
}

export function useHints() {
  return usePromiseContext().hints
}
