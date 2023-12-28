import type { LoaderFunctionArgs } from "@vercel/remix"
import { json, redirect } from "@vercel/remix"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { z } from "zod"
import type { User } from "lucia"
import { auth, discord } from "~/server/auth.server"
import { oauthCookie, getCookie, themeCookie } from "~/server/cookies.server"
import { getSearchParams } from "~/lib/params"
import { defaultTheme } from "~/lib/themes"
import { unreachable } from "~/lib/utils"
import { env } from "~/server/env.server"
import { Users } from "db"

const searchParams = z.union([
  z.object({
    error: z.string(),
  }),
  z.object({
    state: z.string(),
    code: z.string(),
  }),
])

export type SearchParams = z.infer<typeof searchParams>

type PartialDiscordMember = {
  nick: string
  roles: string[]
  user: {
    id: string
    username: string
    avatar: string
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    return json(null, {
      status: 400,
      statusText: "Invalid search params",
    })
  }

  const [existingSession, cookie, theme] = await Promise.all([
    await auth.handleRequest(request).validate(),
    await getCookie(request, oauthCookie),
    await getCookie(request, themeCookie),
  ])

  if (!cookie) {
    return json(null, {
      status: 400,
      statusText: "Missing cookie",
    })
  }

  if ("error" in params.data) {
    switch (params.data.error) {
      case "access_denied":
        return redirect(cookie.from + "?modal=auth")
      default:
        return redirect(cookie.from + "?modal=auth&error=true")
    }
  }

  if (cookie.state !== params.data.state) {
    return json(null, {
      status: 400,
      statusText: "Invalid state",
    })
  }

  try {
    let user: User | null = null

    const { createUser, discordUser, discordTokens } =
      await discord.validateCallback(params.data.code)

    switch (cookie.intent) {
      case "connect": {
        if (!existingSession) {
          return json(null, {
            status: 400,
          })
        }

        await auth.updateUserAttributes(existingSession.user.userId, {
          discord_id: discordUser.id,
          discord_username: discordUser.username,
          discord_metadata: JSON.stringify(discordUser),
        })

        return redirect(cookie.from + "?modal=auth")
      }
      case "login": {
        if (existingSession) {
          return redirect(cookie.from + "?modal=auth")
        }

        user = await Users.fromUsername(discordUser.username)
          .then((user) => (user?.id ? auth.getUser(user.id) : null))
          .catch()

        if (!user) {
          // const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`

          const member: PartialDiscordMember = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${discordTokens.accessToken}`,
              },
            },
          ).then((response) => response.json())

          console.log(member.user.username, member.roles)

          user = await createUser({
            attributes: {
              username: discordUser.username,
              email: discordUser.email!,
              avatar: null,
              discord_id: discordUser.id,
              discord_username: discordUser.username,
              discord_metadata: JSON.stringify(discordUser),
              timestamp: new Date(),
              theme: theme || defaultTheme,
            },
          })

          // const geo = getGeo(request)

          // if (geo) {
          //   await Locations.create({
          //     userId: user.userId,
          //     geo,
          //   })
          // }
        }

        const session = await auth.createSession({
          userId: user.userId,
          attributes: {},
        })

        const sessionCookie = auth.createSessionCookie(session)

        return redirect(cookie.from + "?toast=Logged+in+successfully", {
          headers: {
            "Set-Cookie": sessionCookie.serialize(),
          },
        })
      }
      default:
        return unreachable(cookie.intent)
    }
  } catch (error) {
    console.error(error)
    if (error instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}
