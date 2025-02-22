import "server-only"
import * as v from "valibot"
import type { User } from "@artists-together/core/database"
import { cookieOptions, getCookie } from "@standard-cookie/next"
import type { SessionValidationResult } from "@artists-together/core/auth"
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import { AuthFormSchema, Geolocation } from "~/lib/schemas"
import { WEB_URL } from "~/lib/constants"
import { cache } from "react"

export const cookieSessionOptions = cookieOptions({
  name: SESSION_COOKIE_NAME,
  schema: v.pipe(v.string(), v.nonEmpty()),
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
})

export const cookieOauthOptions = cookieOptions({
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
