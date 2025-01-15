import * as v from "valibot"
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
  type SessionValidationResult,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import type { HTTPEvent } from "vinxi/http"
import { WEB_URL } from "~/lib/constants"
import { createCookie } from "~/lib/cookies"
import { AuthFormSchema, Geolocation } from "~/lib/schemas"

export const cookieSession = createCookie({
  name: SESSION_COOKIE_NAME,
  schema: v.pipe(v.string(), v.nonEmpty()),
  secure: import.meta.env.PROD,
  httpOnly: true,
  sameSite: "lax",
  path: "/",
})

export const cookieOauth = createCookie({
  name: "oauth",
  schema: v.object({
    ...AuthFormSchema.entries,
    geolocation: Geolocation,
    fahrenheit: v.boolean(),
    fullHourFormat: v.boolean(),
    state: v.string(),
  }),
  secure: import.meta.env.PROD,
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

export async function authenticate(
  event: HTTPEvent,
): Promise<SessionValidationResult> {
  const cookie = cookieSession.safeParse()

  if (!cookie.success) {
    return null
  }

  const result = await validateSessionToken(cookie.output)

  if (!result) {
    cookieSession.delete(event)
    return null
  }

  cookieSession.set(cookie.output, {
    expires: result.session.expiresAt,
  })

  return result
}
