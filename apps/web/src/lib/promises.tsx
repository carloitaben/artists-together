"use client"

import type { PropsWithChildren } from "react"
import { use } from "react"
import type { getHints } from "~/features/hints/server"
import { defaultCookieSettings } from "~/features/hints/shared"
import { createRequiredContext } from "./react"
import type { Settings } from "./schemas"

type Promises = {
  hints: ReturnType<typeof getHints>
  settings: Settings | undefined
}

const [PromiseContext, usePromiseContext] =
  createRequiredContext<Promises>("PromiseContext")

export function PromiseProvider({
  children,
  ...value
}: PropsWithChildren<Promises>) {
  return <PromiseContext value={value}>{children}</PromiseContext>
}

export function useHintsPromise() {
  return usePromiseContext().hints
}

export function useHints() {
  return use(useHintsPromise())
}

export function useSettings() {
  return usePromiseContext().settings || defaultCookieSettings
}
