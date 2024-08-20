"use client"

import type { User } from "@artists-together/auth"
import type { ReactNode } from "react"
import { createContext, use } from "react"

const context = createContext<User | null | undefined>(null)

context.displayName = "AuthContext"

export function Provider({ children, value }: { children: ReactNode; value?: User }) {
  return <context.Provider value={value}>{children}</context.Provider>
}

export function getUser() {
  const value = use(context)

  if (typeof value === "undefined") {
    throw Error(`Used ${context.displayName} outside provider`)
  }

  return value
}

export function getUserOrThrow() {
  const value = getUser()

  if (!value) {
    throw Error(`Missing required ${value} context`)
  }

  return value
}
