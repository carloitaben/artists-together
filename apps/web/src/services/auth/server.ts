import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import type { HTTPEvent } from "vinxi/http"
import { WEB_URL } from "~/lib/constants"
import { CookieOAuth, CookieSession } from "~/lib/schemas"
import { Cookie } from "~/lib/server"

export const cookieSession = new Cookie(SESSION_COOKIE_NAME, CookieSession, {
  httpOnly: true,
  sameSite: "lax",
  secure: import.meta.env.PROD,
  path: "/",
})

export const cookieOauth = new Cookie("oauth", CookieOAuth, {
  httpOnly: true,
  sameSite: "lax",
  secure: import.meta.env.PROD,
  path: "/",
  maxAge: 60 * 10,
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

export async function authenticate(event: HTTPEvent) {
  const cookie = cookieSession.safeParse(event)

  if (!cookie.success) {
    return null
  }

  const result = await validateSessionToken(cookie.output)

  if (!result) {
    cookieSession.delete(event)
    return null
  }

  cookieSession.set(event, cookie.output, {
    expires: result.session.expiresAt,
  })

  return result
}
