"use client"

import type { ReactNode } from "react"
import { createContext, createElement, use } from "react"

export function createSafeContext<T>(displayName: string, defaultValue?: T) {
  const Context = createContext<T | null>(defaultValue || null)

  Context.displayName = displayName

  function useContext<Strict extends boolean>(options?: { strict: Strict }) {
    const value = use(Context)

    if (value === null && options?.strict) {
      throw Error(`Called "${displayName}" outside Provider`)
    }

    return value as Strict extends true ? T : T | null
  }

  function SafeProvider(props: { value: T; children?: ReactNode }) {
    return createElement(Context.Provider, props)
  }

  return [SafeProvider, useContext] as const
}
