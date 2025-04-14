"use client"

import { createContext, use, useSyncExternalStore } from "react"

export function createRequiredContext<T>(
  displayName: string,
  defaultValue?: T,
) {
  const Context = createContext<T | undefined>(defaultValue)

  if (process.env.NODE_ENV === "development") {
    Context.displayName = displayName
  }

  function useStrictContext() {
    const value = use(Context)

    if (typeof value === "undefined") {
      throw Error(
        `Context \`${displayName}\` returned \`undefined\`. Seems you forgot to wrap component within its provider`,
      )
    }

    return value as T
  }

  return [Context, useStrictContext] as const
}

export function notifyOnce() {
  return () => {}
}

export function useHydrated() {
  return useSyncExternalStore(
    notifyOnce,
    () => true,
    () => false,
  )
}
