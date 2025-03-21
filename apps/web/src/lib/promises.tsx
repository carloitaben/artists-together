"use client"

import type { User } from "@artists-together/core/database"
import type { PropsWithChildren } from "react"
import { use } from "react"
import type { getHints } from "~/features/hints/server"
import { createRequiredContext } from "./react"

type Promises = {
  hints: ReturnType<typeof getHints>
  user: Promise<User | null>
}

const [PromiseContext, usePromiseContext] =
  createRequiredContext<Promises>("PromiseContext")

export function PromiseProvider({
  children,
  ...value
}: PropsWithChildren<Promises>) {
  return <PromiseContext value={value}>{children}</PromiseContext>
}

export function useUserPromise(): Promise<User | null> {
  return usePromiseContext().user
}

export function useUser(): User | null {
  return use(useUserPromise())
}

export function useHintsPromise() {
  return usePromiseContext().hints
}

export function useHints() {
  return use(useHintsPromise())
}