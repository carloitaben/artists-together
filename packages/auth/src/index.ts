import type { SelectUser } from "@artists-together/db"
import { db, sessions, users } from "@artists-together/db"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"
import type { Session, User } from "lucia"
import { Discord, Twitch } from "arctic"

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

const secure =
  "env" in import.meta && "PROD" in import.meta.env
    ? Boolean(import.meta.env.PROD)
    : process.env.NODE_ENV === "production"

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    attributes: {
      secure,
    },
  },
  getUserAttributes(attributes) {
    return {
      username: attributes.username,
      avatar: attributes.avatar,
      email: attributes.email,
      theme: attributes.theme,
      bio: attributes.bio,
      discordId: attributes.discordId,
      discordUsername: attributes.discordUsername,
      twitchId: attributes.twitchId,
      twitchUsername: attributes.twitchUsername,
      settingsFullHourFormat: attributes.settingsFullHourFormat,
      settingsFahrenheit: attributes.settingsFahrenheit,
      settingsShareCursor: attributes.settingsShareCursor,
      settingsShareLocation: attributes.settingsShareLocation,
      settingsShareStreaming: attributes.settingsShareStreaming,
    } satisfies Partial<SelectUser>
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: SelectUser
  }
}

const SITE_URL = "http://localhost:3000/"

export const provider = {
  discord: new Discord(
    String(process.env.DISCORD_OAUTH_ID),
    String(process.env.DISCORD_OAUTH_SECRET),
    new URL("/api/auth/callback/discord", SITE_URL).toString()
  ),
  twitch: new Twitch(
    String(process.env.TWITCH_OAUTH_ID),
    String(process.env.TWITCH_OAUTH_SECRET),
    new URL("/api/auth/callback/twitch", SITE_URL).toString()
  ),
}

export type AuthenticateResult<Authenticated extends boolean = false> =
  Authenticated extends true
    ? {
        user: User
        session: Session
      }
    :
        | {
            user: User
            session: Session
          }
        | {
            user: null
            session: null
          }

export async function authenticate(
  request: Request
): Promise<AuthenticateResult> {
  const sessionId = lucia.readSessionCookie(request.headers.get("Cookie") ?? "")

  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  return lucia.validateSession(sessionId)
}

export * from "lucia"
