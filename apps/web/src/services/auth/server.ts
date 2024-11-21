import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import type { HTTPEvent } from "vinxi/http"
import { z } from "zod"
import { WEB_URL } from "~/lib/constants"
import { Geolocation, Pathname } from "~/lib/schemas"
import { createCookie } from "~/lib/server"

export const cookieSession = createCookie({
  name: SESSION_COOKIE_NAME,
  schema: z.string().min(1),
  options: {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
  },
})

export const cookieOauth = createCookie({
  name: "oauth",
  schema: z.object({
    geolocation: Geolocation,
    pathname: Pathname,
    state: z.string(),
  }),
  options: {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 60 * 10,
  },
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
  const cookie = cookieSession.get(event)

  if (!cookie.success) {
    return null
  }

  const result = await validateSessionToken(cookie.data)

  if (!result) {
    cookieSession.delete(event)
    return null
  }

  cookieSession.set(event, cookie.data, {
    expires: result.session.expiresAt,
  })

  return result
}
