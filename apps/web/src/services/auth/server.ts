import * as v from "valibot"
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
  type SessionValidationResult,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import { WEB_URL } from "~/lib/constants"
import { AuthFormSchema, Geolocation } from "~/lib/schemas"
import { cookieOptions } from "~/lib/cookies"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"

export const cookieSession = cookieOptions({
  name: SESSION_COOKIE_NAME,
  schema: v.pipe(v.string(), v.nonEmpty()),
  secure: import.meta.env.PROD,
  httpOnly: true,
  sameSite: "lax",
  path: "/",
})

export const cookieOauth = cookieOptions({
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

export async function authenticate(): Promise<SessionValidationResult> {
  const cookie = cookieSession.safeDecode(getCookie(cookieSession.name))

  if (!cookie.success) {
    return null
  }

  const result = await validateSessionToken(cookie.output)

  if (!result) {
    deleteCookie(cookieSession.name)
    return null
  }

  setCookie(cookieSession.name, cookieSession.encode(cookie.output), {
    ...cookieSession.options,
    expires: result.session.expiresAt,
  })

  return result
}
