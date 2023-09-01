import "server-only"
import { lucia } from "lucia"
import { nextjs } from "lucia/middleware"
import { libsql } from "@lucia-auth/adapter-sqlite"
import type { DiscordUser, TwitchUser } from "@lucia-auth/oauth/providers"
import { discord, twitch } from "@lucia-auth/oauth/providers"
import type { Users } from "db"
import { createClient } from "db"
import { z } from "zod"

export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs(),
  adapter: libsql(createClient(), {
    key: "auth_key",
    session: "auth_session",
    user: "user",
  }),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes(data) {
    return {
      email: data.email,
      username: data.username,
      discord_id: data.discord_id,
      discord_username: data.discord_username,
      discord_metadata: data.discord_metadata as DiscordUser,
      avatar: data.avatar,
      twitch_id: data.twitch_id,
      twitch_username: data.twitch_username,
      twitch_metadata: data.twitch_metadata as TwitchUser,
      timestamp: data.timestamp,
    } satisfies Omit<Users.UserInsert, "id">
  },
})

export type Auth = typeof auth

export type UserAttributes = Omit<Users.UserInsertSchema, "id">

function makeRedirectUri(provider: string) {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:3000/auth/${provider}`
    : `https://www.artiststogether.online/auth/${provider}`
}

export const discordAuth = discord(auth, {
  clientId: process.env.DISCORD_OAUTH_ID!,
  clientSecret: process.env.DISCORD_OAUTH_SECRET!,
  redirectUri: makeRedirectUri("discord"),
  scope: ["identify", "email", "guilds"],
})

export const twitchAuth = twitch(auth, {
  clientId: process.env.TWITCH_OAUTH_ID!,
  clientSecret: process.env.TWITCH_OAUTH_SECRET!,
  redirectUri: makeRedirectUri("twitch"),
  scope: [],
})

export const OAuthCookieStateSchema = z.object({
  state: z.string(),
  pathname: z.string(),
})

export type OAuthCookieStateSchema = z.infer<typeof OAuthCookieStateSchema>

export function encodeOAuthCookieState(state: OAuthCookieStateSchema) {
  const parsed = OAuthCookieStateSchema.parse(state)
  return JSON.stringify(parsed)
}

export function decodeOAuthCookieState(state: string) {
  const object = JSON.parse(state)
  return OAuthCookieStateSchema.parse(object)
}
