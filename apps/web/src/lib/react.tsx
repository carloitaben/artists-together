import { createContext, useContext, useSyncExternalStore } from "react"

export function createRequiredContext<T>(
  displayName: string,
  defaultValue?: T,
) {
  const Context = createContext<T | undefined>(defaultValue)

  if (import.meta.env.DEV) {
    Context.displayName = displayName
  }

  function useStrictContext() {
    const value = useContext(Context)

    if (typeof value === "undefined") {
      throw Error(
        `Context \`${displayName}\` returned \`undefined\`. Seems you forgot to wrap component within its provider`,
      )
    }

    return value as T
  }

  return [Context.Provider, useStrictContext] as const
}

export function notifyOnce() {
  return () => {}
}

/**
 * Returns a `boolean` indicating whether React hydrated the page.
 *
 * @example
 * Basic usage
 *
 * ```ts
 * const hydrated = useHydrated()
 * ```
 */
export function useHydrated() {
  return useSyncExternalStore(
    notifyOnce,
    () => true,
    () => false,
  )
}
