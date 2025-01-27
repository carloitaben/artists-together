import * as v from "valibot"
import {
  createSession,
  generateSessionToken,
} from "@artists-together/core/auth"
import {
  database,
  DiscordMetadata,
  locationTable,
  userTable,
} from "@artists-together/core/database"
import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
import type { NextRequest } from "next/server"
import { after } from "next/server"
import {
  getAuth,
  getCookieOauth,
  getCookieSession,
  provider,
} from "~/services/auth/server"
import { AuthEndpointSearchParams } from "~/lib/schemas"

export async function GET(request: NextRequest) {
  const cookieOauth = await getCookieOauth()
  const cookieOauthValue = cookieOauth.get()
  cookieOauth.delete()

  if (!cookieOauthValue.success) {
    return new Response(`Missing or invalid "${cookieOauth.name}" cookie`, {
      status: 400,
    })
  }

  const params = v.safeParse(
    AuthEndpointSearchParams,
    Object.fromEntries(request.nextUrl.searchParams),
  )

  if (!params.success) {
    return new Response("Invalid params", {
      status: 307,
      headers: {
        Location: `${cookieOauthValue.output.pathname}?error`,
      },
    })
  }

  if ("error" in params.output) {
    switch (params.output.error) {
      case "access_denied":
        return new Response("Access denied", {
          status: 307,
          headers: {
            Location: `${cookieOauthValue.output.pathname}?modal=auth`,
          },
        })
      default:
        return new Response(params.output.error_description, {
          status: 307,
          headers: {
            Location: `${cookieOauthValue.output.pathname}?error`,
          },
        })
    }
  }

  if (params.output.state !== cookieOauthValue.output.state) {
    return new Response("OAuth state mismatch", {
      status: 307,
      headers: {
        Location: `${cookieOauthValue.output.pathname}?error`,
      },
    })
  }

  try {
    const [tokens, auth] = await Promise.all([
      provider.discord.validateAuthorizationCode(params.output.code, null),
      getAuth(),
    ])

    const discordUserClient = createDiscord({
      authPrefix: "Bearer",
      token: tokens.accessToken(),
    })

    const discordUser = await discordUserClient.users
      .getCurrent()
      .then((data) => v.parse(DiscordMetadata, data))

    if (!discordUser.verified) {
      return new Response("Unverified", {
        status: 307,
        headers: {
          Location: `${cookieOauthValue.output.pathname}?error=Verify+your+Discord+account+first!`,
        },
      })
    }

    const discordAvatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}`
      : null

    const user = await database
      .insert(userTable)
      .values({
        email: discordUser.email,
        avatar: discordAvatar,
        username: discordUser.username,
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordMetadata: discordUser,
        settings: {
          fahrenheit: Boolean(cookieOauthValue.output.hints?.fahrenheit),
          fullHourFormat: Boolean(
            cookieOauthValue.output.hints?.fullHourFormat,
          ),
          shareCursor: true,
          shareStreaming: true,
        },
      })
      .onConflictDoUpdate({
        target: userTable.email,
        set: {
          avatar: discordAvatar,
          discordId: discordUser.id,
          discordUsername: discordUser.username,
          discordMetadata: discordUser,
        },
      })
      .returning()
      .then(([value]) => value)

    if (!user) {
      return new Response("Failed to upsert user", {
        status: 307,
        headers: {
          Location: `${cookieOauthValue.output.pathname}?error`,
        },
      })
    }

    if (!auth) {
      const sessionToken = generateSessionToken()
      const session = await createSession(sessionToken, user.id)
      const cookieSession = await getCookieSession()
      cookieSession.set(sessionToken, {
        expires: session.expiresAt,
      })
    }

    after(async () => {
      if (cookieOauthValue.output.hints?.geolocation) {
        await database
          .insert(locationTable)
          .values(cookieOauthValue.output.hints.geolocation)
          .onConflictDoNothing({
            target: locationTable.city,
          })
      }

      const discordGuildMember = await discord.guilds.getMember(
        String(process.env.DISCORD_SERVER_ID),
        discordUser.id,
      )

      const shouldAddWebRole =
        discordGuildMember && !discordGuildMember.roles.includes(ROLE.WEB)

      if (shouldAddWebRole) {
        await discord.guilds.addRoleToMember(
          String(process.env.DISCORD_SERVER_ID),
          discordUser.id,
          ROLE.WEB,
          { reason: "Linked Artists Together account" },
        )
      }
    })

    return new Response(
      auth ? "Connected successfully" : "Logged in successfully",
      {
        status: 307,
        headers: {
          Location: `${cookieOauthValue.output.pathname}?toast=Logged+in+as+%40${user.username}`,
        },
      },
    )
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      throw error
    }

    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      {
        status: 307,
        headers: {
          Location: `${cookieOauthValue.output.pathname}?error`,
        },
      },
    )
  }
}
