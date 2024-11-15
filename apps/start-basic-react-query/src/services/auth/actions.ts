import type { SessionValidationResult } from "@artists-together/core/auth"
import {
  validateSessionToken,
  invalidateSession,
} from "@artists-together/core/auth"
import { createServerFn } from "@tanstack/start"
import { redirect } from "@tanstack/react-router"
import { parseWithZod } from "@conform-to/zod"
import { generateState } from "arctic"
import { AuthFormSchema } from "~/lib/schemas"
import { getGeolocation } from "~/lib/server"
import { cookieOauth, cookieSession, provider } from "./server"
import { getEvent } from "vinxi/http"

export const authenticate = createServerFn(
  "GET",
  async (): Promise<SessionValidationResult> => {
    const cookie = cookieSession.get(getEvent())

    if (!cookie.success) {
      return null
    }

    const result = await validateSessionToken(cookie.data)

    if (!result) {
      cookieSession.delete(getEvent())
      return null
    }

    cookieSession.set(getEvent(), cookie.data, {
      expires: result.session.expiresAt,
    })

    return result
  },
)

export const login = createServerFn("POST", async (formData: FormData) => {
  const form = parseWithZod(formData, {
    schema: AuthFormSchema,
  })

  if (form.status !== "success") {
    return
  }

  if (cookieSession.has(getEvent())) {
    return
  }

  const geolocation = getGeolocation()
  const state = generateState()
  const url = provider.discord.createAuthorizationURL(state, [
    "identify",
    "email",
  ])

  cookieOauth.set(getEvent(), {
    pathname: form.value.pathname,
    geolocation,
    state,
  })

  throw redirect({
    to: url.href,
  })
})

export const logout = createServerFn("POST", async (formData: FormData) => {
  const parsed = parseWithZod(formData, {
    schema: AuthFormSchema,
  })

  if (parsed.status !== "success") {
    return parsed.reply()
  }

  const auth = await authenticate()

  if (!auth) {
    return
  }

  invalidateSession(auth.session.id)
  cookieSession.delete(getEvent())
})

export const linkDiscord = createServerFn("GET", async () => {
  // link discord
})

export const linkTwitch = createServerFn("GET", async () => {
  // link twitch
})

export const unlinkDiscord = createServerFn("GET", async () => {
  // link discord
})

export const unlinkTwitch = createServerFn("GET", async () => {
  // link twitch
})
