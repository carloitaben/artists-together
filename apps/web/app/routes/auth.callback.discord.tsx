import type { LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { z } from "zod"
import type { User } from "lucia"
import { auth, discord } from "~/services/auth.server"
import { oauthCookie, getCookie, themeCookie } from "~/services/cookies.server"
import { getParams } from "~/lib/params"
import { defaultTheme } from "~/lib/themes"

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
  const params = getParams(request, searchParams)

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

  if (existingSession) {
    return redirect(cookie.from)
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

    const { getExistingUser, discordUser, createUser, discordTokens } =
      await discord.validateCallback(params.data.code)

    user = await getExistingUser()

    if (!user) {
      const avatar = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`

      const member: PartialDiscordMember = await fetch(
        `https://discord.com/api/v10/users/@me/guilds/${process.env.DISCORD_SERVER_ID}/member`,
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
          avatar: avatar,
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

    return redirect(cookie.from, {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    })
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