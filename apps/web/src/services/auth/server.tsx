import "server-only"
import {
  authenticator,
  authenticate as authenticateImpl,
} from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import { cache } from "react"
import { cookies } from "next/headers"
import { z } from "zod"
import { Geolocation } from "~/lib/headers/server"
import { createCookie } from "~/lib/server"
import { Pathname } from "~/lib/schemas"
import { WEB_URL } from "~/lib/constants"

export const oauthCookie = createCookie(
  "oauth",
  z.object({
    geolocation: Geolocation,
    pathname: Pathname,
    state: z.string(),
  }),
  {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  },
)

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

export const authenticate = cache(() => {
  const cookie = cookies().get(authenticator.sessionCookieName)?.value ?? null
  return authenticateImpl(cookie)
})
