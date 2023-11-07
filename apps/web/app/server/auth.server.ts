import type { Users } from "db"
import { createClient } from "db"
import { lucia } from "lucia"
import { web } from "lucia/middleware"
import { libsql } from "@lucia-auth/adapter-sqlite"
import { discord, twitch } from "@lucia-auth/oauth/providers"
import { env } from "~/lib/env"

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
    console.log(user)

    return {
      email: user.email,
      theme: user.theme,
      username: user.username,
      bio: user.bio,
      links: user.links,
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      avatar: user.avatar,
      twitch_id: user.twitch_id,
      twitch_username: user.twitch_username,
    }
  },
  getSessionAttributes() {
    return {}
  },
})

export type Auth = typeof auth

export type UserAttributes = Users.UsersSelectSchema

const discordAuth = discord(auth, {
  clientId: env.DISCORD_OAUTH_ID,
  clientSecret: env.DISCORD_OAUTH_SECRET,
  redirectUri: `${env.VERCEL_URL}/auth/callback/discord`,
  scope: ["identify", "email", "guilds", "guilds.members.read"],
})

const twitchAuth = twitch(auth, {
  clientId: env.TWITCH_OAUTH_ID,
  clientSecret: env.TWITCH_OAUTH_SECRET,
  redirectUri: `${env.VERCEL_URL}/auth/callback/twitch`,
  scope: [],
})

export { discordAuth as discord, twitchAuth as twitch }
