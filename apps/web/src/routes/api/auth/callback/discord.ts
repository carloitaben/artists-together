import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
import { createAPIFileRoute } from "@tanstack/start/api"
import { isRedirect } from "@tanstack/react-router"
import {
  createError,
  getEvent,
  getRequestURL,
  send,
  sendError,
  sendRedirect,
  sendWebResponse,
  setResponseStatus,
} from "vinxi/http"
import { AuthEndpointSearchParams } from "~/lib/schemas"
import {
  authenticate,
  cookieOauth,
  cookieSession,
  provider,
} from "~/services/auth/server"
import {
  database,
  locationTable,
  userTable,
} from "@artists-together/core/database"
import {
  createSession,
  generateSessionToken,
} from "@artists-together/core/auth"

export const Route = createAPIFileRoute("/api/auth/callback/discord")({
  async GET() {
    const event = getEvent()
    const cookie = cookieOauth.flash(event)

    if (!cookie.success) {
      setResponseStatus(400)
      return new Response("Missing or invalid oauth cookie")
    }

    const params = AuthEndpointSearchParams.safeParse(
      Object.fromEntries(getRequestURL().searchParams),
    )

    if (!params.success) {
      await sendRedirect(`${cookie.data.pathname}?error`)
      return new Response()
    }

    if ("error" in params.data) {
      switch (params.data.error) {
        case "access_denied":
          await sendRedirect(`${cookie.data.pathname}?modal=auth`)
          return new Response()
        default:
          await sendRedirect(`${cookie.data.pathname}?error`)
          return new Response()
      }
    }

    if (params.data.state !== cookie.data.state) {
      await sendRedirect(`${cookie.data.pathname}?error`)
      return new Response()
    }

    try {
      const [tokens, auth] = await Promise.all([
        provider.discord.validateAuthorizationCode(params.data.code),
        authenticate(event),
      ])

      const discordUserClient = createDiscord({
        authPrefix: "Bearer",
        token: tokens.accessToken(),
      })

      const discordUser = await discordUserClient.users.getCurrent()

      if (!discordUser.verified) {
        await sendRedirect(`${cookie.data.pathname}?error`)
        return new Response()
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
            fahrenheit: cookie.data.fahrenheit,
            fullHourFormat: cookie.data.fullHourFormat,
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
        await sendRedirect(`${cookie.data.pathname}?error`)
        return new Response()
      }

      if (!auth) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.id)
        cookieSession.set(getEvent(), sessionToken, {
          expires: session.expiresAt,
        })
      }

      const maybeInsertGeolocationPromise =
        cookie.data.geolocation &&
        database
          .insert(locationTable)
          .values(cookie.data.geolocation)
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

      await sendRedirect(
        `${cookie.data.pathname}?toast=Logged%20in%20as%20%40${user.username}`,
      )

      return new Response()
    } catch (error) {
      if (error instanceof Response) {
        return error
      }

      console.error(error)
      await sendRedirect(`${cookie.data.pathname}?error`)
      return new Response()
    }
  },
})
