// import { isRedirect } from "@tanstack/react-router"
import { AnyJSONString } from "@artists-together/core/schemas"
import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
import { createAPIFileRoute } from "@tanstack/start/api"
import {
  deleteCookie,
  getCookie,
  getEvent,
  getRequestURL,
  sendRedirect,
} from "vinxi/http"
import { z } from "zod"
// import { getHints } from "~/lib/data"
import { AuthEndpointSearchParams, OAuthCookieSchema } from "~/lib/schemas"
import { cookieSession, provider } from "~/services/auth/server"
import { database, userTable } from "@artists-together/core/database"
import {
  createSession,
  generateSessionToken,
} from "@artists-together/core/auth"
// import { cookieOauth, provider } from "~/services/auth/server"
// import { createDiscord, discord, ROLE } from "@artists-together/core/discord"
// import {
//   database,
//   locationTable,
//   userTable,
// } from "@artists-together/core/database"
// import {
//   createSession,
//   generateSessionToken,
//   validateSessionToken,
// } from "@artists-together/core/auth"
// import { getRequestURL, sendError, sendRedirect } from "vinxi/http"
// import { getHints } from "~/lib/data"
// import { AuthEndpointSearchParams } from "~/lib/schemas"
// import {
//   cookieOauth,
//   cookieSessionToken,
//   provider,
// } from "~/services/auth/server"

// async function authenticate() {
//   const cookie = cookieSessionToken.get()

//   if (!cookie.success) {
//     return null
//   }

//   const result = await validateSessionToken(cookie.data)

//   if (!result) {
//     cookieSessionToken.delete()
//     return null
//   }

//   cookieSessionToken.set(cookie.data, {
//     expires: result.session.expiresAt,
//   })

//   return result
// }

export const Route = createAPIFileRoute("/api/auth/callback/discord")({
  async GET() {
    const cookie = AnyJSONString.pipe(OAuthCookieSchema).safeParse(
      getCookie("oauth"),
    )

    deleteCookie("oauth")

    if (!cookie.success) {
      return new Response(null, {
        status: 400,
        statusText: "Missing or invalid oauth cookie",
      })
    }

    const params = AuthEndpointSearchParams.safeParse(
      Object.fromEntries(getRequestURL().searchParams),
    )

    if (!params.success) {
      return sendRedirect(`${cookie.data.pathname}?error`)
    }

    if ("error" in params.data) {
      switch (params.data.error) {
        case "access_denied":
          return sendRedirect(`${cookie.data.pathname}?modal=auth`)
        default:
          return sendRedirect(`${cookie.data.pathname}?error`)
      }
    }

    if (params.data.state !== cookie.data.state) {
      return sendRedirect(`${cookie.data.pathname}?error`)
    }

    try {
      const tokens = await provider.discord.validateAuthorizationCode(
        params.data.code,
      )

      const discordUserClient = createDiscord({
        authPrefix: "Bearer",
        token: tokens.accessToken(),
      })

      const discordUser = await discordUserClient.users.getCurrent()

      if (!discordUser.verified) {
        return sendRedirect(`${cookie.data.pathname}?error`)
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
            // fahrenheit: hintsStore.temperatureUnit === "fahrenheit",
            // fullHourFormat: hintsStore.hourFormat === "24",
            fahrenheit: false, // TODO: remove this
            fullHourFormat: true, // TODO: remove this
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
        return sendRedirect(`${cookie.data.pathname}?error`)
      }

      const sessionToken = generateSessionToken()
      const session = await createSession(sessionToken, user.id)
      cookieSession.set(getEvent(), sessionToken, {
        expires: session.expiresAt,
      })

      // unstable_after(async () => {
      //   const maybeInsertGeolocationPromise =
      //     cookie.data.geolocation &&
      //     database
      //       .insert(locationTable)
      //       .values(cookie.data.geolocation)
      //       .onConflictDoNothing({ target: locationTable.city })
      //       .catch(console.error)

      //   const maybeAddDiscordRolePromise =
      //     shouldAddWebRole &&
      //     discord.guilds
      //       .addRoleToMember(
      //         String(process.env.DISCORD_SERVER_ID),
      //         discordUser.id,
      //         ROLE.WEB,
      //         { reason: "Linked Artists Together account" },
      //       )
      //       .catch(console.error)

      //   await Promise.all([
      //     maybeInsertGeolocationPromise,
      //     maybeAddDiscordRolePromise,
      //   ])
      // })
      return sendRedirect(
        `${cookie.data.pathname}?toast=Logged+in+as+%40${user.username}`,
      )
    } catch (error) {
      console.error(error)
      return sendRedirect(`${cookie.data.pathname}?error`)
    }
  },
})

// import {
//   createSession,
//   generateSessionToken,
// } from "@artists-together/core/auth"
// import {
//   database,
//   userTable,
//   locationTable,
// } from "@artists-together/core/database"
// import { discord, createDiscord, ROLE } from "@artists-together/core/discord"
// import { isRedirectError } from "next/dist/client/components/redirect"
// import { redirect } from "next/navigation"
// import type { NextRequest } from "next/server"
// import { unstable_after } from "next/server"
// import { z } from "zod"
// import {
//   authenticate,
//   oauthCookie,
//   provider,
//   setSessionTokenCookie,
// } from "~/services/auth/server"
// import { hints } from "~/lib/headers/server"
// import { parseSearchParams } from "~/lib/server"

// const searchParams = z.union([
//   z.object({
//     error: z.string(),
//     error_description: z.string().optional(),
//   }),
//   z.object({
//     code: z.string().min(1),
//     state: z.string().min(1),
//   }),
// ])

// export async function GET(request: NextRequest) {
//   const cookie = oauthCookie.get()

//   if (!cookie.success) {
//     throw new Response(null, {
//       status: 400,
//       statusText: "Missing or invalid oauth cookie",
//     })
//   }

//   oauthCookie.delete()

//   const params = parseSearchParams(request.nextUrl.searchParams, {
//     schema: searchParams,
//   })

//   if (!params.success) {
//     return redirect(`${cookie.data.pathname}?error`)
//   }

//   if ("error" in params.data) {
//     switch (params.data.error) {
//       case "access_denied":
//         return redirect(`${cookie.data.pathname}?modal=auth`)
//       default:
//         return redirect(`${cookie.data.pathname}?error`)
//     }
//   }

//   if (params.data.state !== cookie.data.state) {
//     return redirect(`${cookie.data.pathname}?error`)
//   }

//   try {
//     const [tokens, auth, hintsStore] = await Promise.all([
//       provider.discord.validateAuthorizationCode(params.data.code),
//       authenticate(),
//       hints(),
//     ])

//     const discordUser = await createDiscord({
//       authPrefix: "Bearer",
//       token: tokens.accessToken(),
//     }).users.getCurrent(request)

//     const discordGuildMember = await discord.guilds
//       .getMember(String(process.env.DISCORD_SERVER_ID), discordUser.id)
//       .catch(() => null)

//     const shouldAddWebRole =
//       discordGuildMember && !discordGuildMember.roles.includes(ROLE.WEB)

//     const discordAvatarId = discordGuildMember?.avatar || discordUser.avatar

//     // TODO: upload this to our R2 bucket
//     const discordAvatar = discordAvatarId
//       ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordAvatarId}`
//       : null

//     const user = await database
//       .insert(userTable)
//       .values({
//         email: discordUser.email,
//         avatar: discordAvatar,
//         username: discordUser.username,
//         discordId: discordUser.id,
//         discordUsername: discordUser.username,
//         discordMetadata: discordUser,
//         settings: {
//           fahrenheit: hintsStore.temperatureUnit === "fahrenheit",
//           fullHourFormat: hintsStore.hourFormat === "24",
//           shareCursor: true,
//           shareLocation: true,
//           shareStreaming: true,
//         },
//       })
//       .onConflictDoUpdate({
//         target: userTable.email,
//         set: {
//           avatar: discordAvatar,
//           discordId: discordUser.id,
//           discordUsername: discordUser.username,
//           discordMetadata: discordUser,
//         },
//       })
//       .returning()
//       .then(([value]) => value)

//     if (!user) {
//       return redirect(`${cookie.data.pathname}?error`)
//     }

//     if (!auth) {
//       const sessionToken = generateSessionToken()
//       const session = await createSession(sessionToken, user.id)
//       setSessionTokenCookie(sessionToken, session.expiresAt)
//     }

//     unstable_after(async () => {
//       const maybeInsertGeolocationPromise =
//         cookie.data.geolocation &&
//         database
//           .insert(locationTable)
//           .values(cookie.data.geolocation)
//           .onConflictDoNothing({ target: locationTable.city })
//           .catch(console.error)

//       const maybeAddDiscordRolePromise =
//         shouldAddWebRole &&
//         discord.guilds
//           .addRoleToMember(
//             String(process.env.DISCORD_SERVER_ID),
//             discordUser.id,
//             ROLE.WEB,
//             { reason: "Linked Artists Together account" },
//           )
//           .catch(console.error)

//       await Promise.all([
//         maybeInsertGeolocationPromise,
//         maybeAddDiscordRolePromise,
//       ])
//     })

//     return redirect(
//       `${cookie.data.pathname}?toast=Logged+in+as+%40${user.username}`,
//     )
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error
//     }

//     console.error(error)
//     return redirect(`${cookie.data.pathname}?error`)
//   }
// }
