import type { Users } from "db"
import { createClient } from "db"
import { lucia } from "lucia"
import { web } from "lucia/middleware"
import { libsql } from "@lucia-auth/adapter-sqlite"
import type { DiscordUser, TwitchUser } from "@lucia-auth/oauth/providers"
import { discord, twitch } from "@lucia-auth/oauth/providers"
import { url } from "~/lib/env"

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: web(),
  adapter: libsql(createClient(), {
    key: "auth_key",
    session: "auth_session",
    user: "users",
  }),
  sessionCookie: {
    expires: false,
    name: "session_v0",
  },
  getUserAttributes(user) {
    return {
      email: user.email,
      theme: user.theme,
      username: user.username,
      bio: user.bio,
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      discord_metadata: user.discord_metadata as DiscordUser,
      avatar: user.avatar,
      twitch_id: user.twitch_id,
      twitch_username: user.twitch_username,
      twitch_metadata: user.twitch_metadata as TwitchUser,
      timestamp: user.timestamp,
    } satisfies Omit<Users.UsersInsert, "id">
  },
  getSessionAttributes() {
    return {}
  },
})

export type Auth = typeof auth

export type UserAttributes = Omit<Users.UsersInsertSchema, "id">

const discordAuth = discord(auth, {
  clientId: String(process.env.DISCORD_OAUTH_ID),
  clientSecret: String(process.env.DISCORD_OAUTH_SECRET),
  redirectUri: `${url}/auth/callback/discord`,
  scope: ["identify", "email", "guilds", "guilds.members.read"],
})

const twitchAuth = twitch(auth, {
  clientId: String(process.env.TWITCH_OAUTH_ID),
  clientSecret: String(process.env.TWITCH_OAUTH_SECRET),
  redirectUri: `${url}/auth/callback/twitch`,
  scope: [],
})

export { discordAuth as discord, twitchAuth as twitch }
