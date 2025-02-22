"use server"

import type { User } from "@artists-together/core/database"
import type { SessionValidationResult } from "@artists-together/core/auth"
import { validateSessionToken } from "@artists-together/core/auth"
import { getCookie } from "@standard-cookie/next"
import { cache } from "react"
import { cookieSessionOptions } from "./server"

export const getAuth = cache(async (): Promise<SessionValidationResult> => {
  const cookieSession = await getCookie(cookieSessionOptions)

  if (!cookieSession) {
    return null
  }

  return validateSessionToken(cookieSession)
})

export const getUser = cache(async (): Promise<User | null> => {
  return getAuth().then((auth) => auth?.user || null)
})
