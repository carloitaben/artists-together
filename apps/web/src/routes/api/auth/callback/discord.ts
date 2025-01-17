import * as v from "valibot"
import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
import { database } from "@artists-together/core/database/client"
import {
  locationTable,
  userTable,
} from "@artists-together/core/database/schema"
import {
  createSession,
  generateSessionToken,
} from "@artists-together/core/auth"
import { createAPIFileRoute } from "@tanstack/start/api"
import { deleteCookie, getCookie, getRequestURL, setCookie } from "vinxi/http"
import {
  authenticate,
  cookieOauth,
  cookieSession,
  provider,
} from "~/services/auth/server"
import { AuthEndpointSearchParams } from "~/lib/schemas"

export const APIRoute = createAPIFileRoute("/api/auth/callback/discord")({
  async GET() {
    const cookie = cookieOauth.safeDecode(getCookie(cookieOauth.name))
    deleteCookie(cookieOauth.name)

    if (!cookie.success) {
      return new Response("Missing or invalid oauth cookie", {
        status: 400,
      })
    }

    const params = v.safeParse(
      AuthEndpointSearchParams,
      Object.fromEntries(getRequestURL().searchParams),
    )

    if (!params.success) {
      return new Response("Invalid params", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?error`,
        },
      })
    }

    if ("error" in params.output) {
      switch (params.output.error) {
        case "access_denied":
          return new Response("Access denied", {
            status: 307,
            headers: {
              Location: `${cookie.output.pathname}?modal=auth`,
            },
          })
        default:
          return new Response(params.output.error_description, {
            status: 307,
            headers: {
              Location: `${cookie.output.pathname}?error`,
            },
          })
      }
    }

    if (params.output.state !== cookie.output.state) {
      return new Response("OAuth state mismatch", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?error`,
        },
      })
    }

    try {
      const [tokens, auth] = await Promise.all([
        provider.discord.validateAuthorizationCode(params.output.code, null),
        authenticate(),
      ])

      const discordUserClient = createDiscord({
        authPrefix: "Bearer",
        token: tokens.accessToken(),
      })

      const discordUser = await discordUserClient.users.getCurrent()

      if (!discordUser.verified) {
        return new Response("Unverified", {
          status: 307,
          headers: {
            Location: `${cookie.output.pathname}?error=Your%20Discord%20account%20has%20to%20be%20verified`,
          },
        })
      }

      const discordGuildMember = await discord.guilds
        .getMember(String(process.env.DISCORD_SERVER_ID), discordUser.id)
        .catch(() => null)

      const shouldAddWebRole =
        discordGuildMember && !discordGuildMember.roles.includes(ROLE.WEB)

      const discordAvatarId = discordGuildMember?.avatar || discordUser.avatar

      const discordAvatar = discordAvatarId
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordAvatarId}`
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
            fahrenheit: cookie.output.fahrenheit,
            fullHourFormat: cookie.output.fullHourFormat,
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
        return new Response("Failed to create user", {
          status: 307,
          headers: {
            Location: `${cookie.output.pathname}?error`,
          },
        })
      }

      if (!auth) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.id)
        setCookie(cookieSession.name, cookieSession.encode(sessionToken), {
          ...cookieSession.options,
          expires: session.expiresAt,
        })
      }

      if (cookie.output.geolocation) {
        database
          .insert(locationTable)
          .values(cookie.output.geolocation)
          .onConflictDoNothing({
            target: locationTable.city,
          })
          .catch(console.error)
      }

      if (shouldAddWebRole) {
        discord.guilds
          .addRoleToMember(
            String(process.env.DISCORD_SERVER_ID),
            discordUser.id,
            ROLE.WEB,
            { reason: "Linked Artists Together account" },
          )
          .catch(console.error)
      }

      return new Response("Logged in successfully", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?toast=Logged%20in%20as%20%40${user.username}`,
        },
      })
    } catch (error) {
      return new Response(
        error instanceof Error ? error.message : "Unexpected error",
        {
          status: 307,
          headers: {
            Location: `${cookie.output.pathname}?error`,
          },
        },
      )
    }
  },
})
