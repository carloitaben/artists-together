import * as v from "valibot"
import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
import {
  database,
  locationTable,
  userTable,
} from "@artists-together/core/database"
import {
  createSession,
  generateSessionToken,
} from "@artists-together/core/auth"
import { createAPIFileRoute } from "@tanstack/start/api"
import {
  getEvent,
  getRequestURL,
  setResponseHeader,
  setResponseStatus,
} from "vinxi/http"
import {
  authenticate,
  cookieOauth,
  cookieSession,
  provider,
} from "~/services/auth/server"
import { AuthEndpointSearchParams } from "~/lib/schemas"

export const Route = createAPIFileRoute("/api/auth/callback/discord")({
  async GET() {
    const event = getEvent()
    const cookie = cookieOauth.safeParse(event)
    cookieOauth.delete(event)

    if (!cookie.success) {
      setResponseStatus(400)
      return new Response("Missing or invalid oauth cookie")
    }

    const params = v.safeParse(
      AuthEndpointSearchParams,
      Object.fromEntries(getRequestURL().searchParams),
    )

    if (!params.success) {
      setResponseStatus(307)
      setResponseHeader("location", `${cookie.output.pathname}?error`)
      return new Response("Invalid params")
    }

    if ("error" in params.output) {
      switch (params.output.error) {
        case "access_denied":
          setResponseStatus(307)
          setResponseHeader("location", `${cookie.output.pathname}?modal=auth`)
          return new Response()
        default:
          setResponseStatus(307)
          setResponseHeader("location", `${cookie.output.pathname}?error`)
          return new Response(params.output.error_description)
      }
    }

    if (params.output.state !== cookie.output.state) {
      setResponseStatus(307)
      setResponseHeader("location", `${cookie.output.pathname}?error`)
      return new Response("OAuth state mismatch")
    }

    try {
      const [tokens, auth] = await Promise.all([
        provider.discord.validateAuthorizationCode(params.output.code, null),
        authenticate(event),
      ])

      const discordUserClient = createDiscord({
        authPrefix: "Bearer",
        token: tokens.accessToken(),
      })

      const discordUser = await discordUserClient.users.getCurrent()

      if (!discordUser.verified) {
        setResponseStatus(307)
        setResponseHeader(
          "location",
          `${cookie.output.pathname}?error=Verify%20your%20Discord%20account%20first`,
        )

        return new Response("Unverified")
      }

      const discordGuildMember = await discord.guilds
        .getMember(String(process.env.DISCORD_SERVER_ID), discordUser.id)
        .catch(() => null)

      const shouldAddWebRole =
        discordGuildMember && !discordGuildMember.roles.includes(ROLE.WEB)

      const discordAvatarId = discordGuildMember?.avatar || discordUser.avatar

      // TODO: upload this to our R2 bucket
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
        setResponseStatus(307)
        setResponseHeader("location", `${cookie.output.pathname}?error`)
        return new Response("Failed to create user")
      }

      if (!auth) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.id)
        cookieSession.set(getEvent(), sessionToken, {
          expires: session.expiresAt,
        })
      }

      const maybeInsertGeolocationPromise =
        cookie.output.geolocation &&
        database
          .insert(locationTable)
          .values(cookie.output.geolocation)
          .onConflictDoNothing({
            target: locationTable.city,
          })
          .catch(console.error)

      const maybeAddDiscordRolePromise =
        shouldAddWebRole &&
        discord.guilds
          .addRoleToMember(
            String(process.env.DISCORD_SERVER_ID),
            discordUser.id,
            ROLE.WEB,
            { reason: "Linked Artists Together account" },
          )
          .catch(console.error)

      await Promise.all([
        maybeInsertGeolocationPromise,
        maybeAddDiscordRolePromise,
      ])

      setResponseStatus(307)
      setResponseHeader(
        "location",
        `${cookie.output.pathname}?toast=Logged%20in%20as%20%40${user.username}`,
      )

      return new Response("Logged in successfully")
    } catch (error) {
      setResponseStatus(307)
      setResponseHeader("location", `${cookie.output.pathname}?error`)
      return new Response(
        error instanceof Error ? error.message : "Unexpected error",
      )
    }
  },
})
