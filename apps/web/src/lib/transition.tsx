"use client"

import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"
import { useEffect, useState, useTransition } from "react"
import { createRequiredContext } from "./react"

export type TransitionRouterState = {
  from: string | undefined
  to: string | undefined
}

export type TransitionRouterStage = "entering" | "leaving" | undefined

type TransitionRouterStartFunction = (
  to: string | undefined,
  callback: () => void | Promise<void>,
) => void

type TransitionRouterContext = [
  stage: TransitionRouterStage,
  startRouteTransition: TransitionRouterStartFunction,
]

const [TransitionRouterContextProvider, useTransitionRouterContext] =
  createRequiredContext<TransitionRouterContext>("TransitionRouterContext")

export type TransitionRouterCallback = (
  state: TransitionRouterState,
) => Promise<void | VoidFunction>

export function TransitionRouter({
  children,
  leave,
  enter,
}: PropsWithChildren<{
  leave: TransitionRouterCallback
  enter: TransitionRouterCallback
}>) {
  const [state, setState] = useState<TransitionRouterState>()
  const [stage, setStage] = useState<TransitionRouterStage>()
  const [, startTransition] = useTransition()
  const pathname = usePathname()

  useEffect(() => {
    if (!state) return

    setStage("entering")
    startTransition(async () => {
      await enter(state).then((cleanup) => cleanup?.())
      setStage(undefined)
      setState(undefined)
    })
  }, [enter, state])

  const startRouteTransition: TransitionRouterStartFunction = (
    to,
    callback,
  ) => {
    setStage("leaving")
    startTransition(async () => {
      const state = { from: pathname, to }
      setState(state)
      await leave(state).then((cleanup) => cleanup?.())
      await callback()
    })
  }

  const value: TransitionRouterContext = [stage, startRouteTransition]

  return (
    <TransitionRouterContextProvider value={value}>
      {children}
    </TransitionRouterContextProvider>
  )
}

export const useRouterTransition = useTransitionRouterContext
