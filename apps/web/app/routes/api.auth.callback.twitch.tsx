import type { LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { z } from "zod"
import { auth, twitch } from "~/server/auth.server"
import { oauthCookie, getCookie } from "~/server/cookies.server"
import { getSearchParams } from "~/lib/params"

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

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    return json(null, {
      status: 400,
      statusText: "Invalid search params",
    })
  }

  const [existingSession, cookie] = await Promise.all([
    await auth.handleRequest(request).validate(),
    await getCookie(request, oauthCookie),
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

  if (!existingSession) {
    return redirect(cookie.from)
  }

  if (cookie.intent !== "connect") {
    return json(null, {
      status: 400,
      statusText: "Invalid intent",
    })
  }

  try {
    const { twitchUser } = await twitch.validateCallback(params.data.code)

    await auth.updateUserAttributes(existingSession.user.userId, {
      twitch_id: twitchUser.id,
      twitch_username: twitchUser.login,
      twitch_metadata: JSON.stringify(twitchUser),
    })

    return redirect(cookie.from + "?modal=auth")
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
