import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { auth, twitchAuth } from "~/services/auth"
import { getSession, decodeOAuthCookieState } from "~/services/auth"

export const runtime = "edge"
export const preferredRegion = "global" // TODO: replace with turso db region array, as it supports string[]

export const GET = async (request: NextRequest) => {
  const session = await getSession()

  if (!session) {
    return new Response(null, {
      status: 400,
    })
  }

  const cookieStore = cookies()
  const cookieValue = cookieStore.get("twitch_oauth_state")?.value

  if (!cookieValue) {
    return new Response(null, {
      status: 400,
    })
  }

  const cookieState = decodeOAuthCookieState(cookieValue)
  const url = new URL(request.url)
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")
  const code = url.searchParams.get("code")

  if (error) {
    switch (error) {
      case "access_denied":
        return redirect(cookieState.pathname + "?modal=login")
      default:
        return redirect(cookieState.pathname + "?error=true&modal=login")
    }
  }

  if (!state || cookieState.state !== state || !code) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const { twitchUser } = await twitchAuth.validateCallback(code)

    await auth.updateUserAttributes(session.user.userId, {
      twitch_id: twitchUser.id,
      twitch_username: twitchUser.login,
      twitch_metadata: JSON.stringify(twitchUser),
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: cookieState.pathname,
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
