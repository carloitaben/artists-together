import "server-only"
import { validateSessionToken } from "@artists-together/core/auth"
import { Discord, Twitch } from "arctic"
import { cache } from "react"
import { cookies } from "next/headers"
import { z } from "zod"
import { Geolocation } from "~/lib/headers/server"
import { Pathname } from "~/lib/schemas"
import { createCookie } from "~/lib/server"
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

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookiesStore = await cookies()

  cookiesStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export async function deleteSessionTokenCookie() {
  const cookiesStore = await cookies()

  cookiesStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

export const authenticate = cache(async () => {
  const cookiesStore = await cookies()

  const token = cookiesStore.get("session")?.value ?? null

  if (token === null) {
    return null
  }

  return validateSessionToken(token)
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
