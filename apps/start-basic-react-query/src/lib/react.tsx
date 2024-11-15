import type { ReactNode } from "react"
import { createContext, useContext, useSyncExternalStore } from "react"

const empty = Symbol("Empty React context")

export function createContextFactory<T>(displayName: string, defaultValue?: T) {
  const Context = createContext<T | typeof empty>(defaultValue ?? empty)

  Context.displayName = displayName

  function useContextFactory<Strict extends boolean>(options?: {
    strict: Strict
  }): Strict extends true ? NonNullable<T> : T | null {
    const value = useContext(Context)

    if (value === empty) {
      if (options?.strict) {
        throw Error(`Called "${displayName}" outside Provider`)
      }

      return null as any
    }

    if (!value) {
      if (options?.strict) {
        throw Error(
          `Called "${displayName}" with strict flag enabled, but received "${typeof value}"`,
        )
      }
    }

    return value as any
  }

  function Provider({
    value,
    children = null,
  }: {
    value: T
    children?: ReactNode
  }) {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return [Provider, useContextFactory] as const
}

export function subscribeOnce() {
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
    subscribeOnce,
    () => true,
    () => false,
  )
}
