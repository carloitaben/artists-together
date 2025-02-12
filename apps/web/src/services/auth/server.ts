import "server-only"
import * as v from "valibot"
import type { SessionValidationResult } from "@artists-together/core/auth"
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
} from "@artists-together/core/auth"
import { cache } from "react"
import { Discord, Twitch } from "arctic"
import { AuthFormSchema, Geolocation } from "~/lib/schemas"
import { createCookie } from "~/lib/server"
import { WEB_URL } from "~/lib/constants"

export const getCookieSession = createCookie({
  name: SESSION_COOKIE_NAME,
  schema: v.pipe(v.string(), v.nonEmpty()),
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
})

export const getCookieOauth = createCookie({
  name: "oauth",
  schema: v.object({
    ...AuthFormSchema.entries,
    state: v.string(),
    hints: v.optional(
      v.object({
        geolocation: Geolocation,
        fahrenheit: v.boolean(),
        fullHourFormat: v.boolean(),
      }),
    ),
  }),
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 10,
  path: "/",
})

export const getAuth = cache(async (): Promise<SessionValidationResult> => {
  const cookieSession = await getCookieSession()
  const cookieSessionValue = cookieSession.get()

  if (!cookieSessionValue.success) {
    return null
  }

  return validateSessionToken(cookieSessionValue.output)
})

export const provider = {
  discord: new Discord(
    String(process.env.OAUTH_DISCORD_ID),
    String(process.env.OAUTH_DISCORD_SECRET),
    new URL("/api/auth/callback/discord", WEB_URL).href,
  ),
  twitch: new Twitch(
    String(process.env.OAUTH_TWITCH_ID),
    String(process.env.OAUTH_TWITCH_SECRET),
    new URL("/api/auth/callback/twitch", WEB_URL).href,
  ),
}
