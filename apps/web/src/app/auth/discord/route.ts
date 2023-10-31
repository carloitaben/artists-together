import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { Locations } from "db"
import { auth, discordAuth, decodeOAuthCookieState } from "~/services/auth"
import { getThemeFromCookie } from "~/services/theme"
import { getGeo } from "~/lib/geo"

export const runtime = "edge"
export const preferredRegion = "global" // TODO: replace with turso db region array, as it supports string[]

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies })
  const existingSession = await authRequest.validate()

  if (existingSession) {
    return redirect("/")
  }

  const cookieStore = cookies()
  const cookieValue = cookieStore.get("discord_oauth_state")?.value

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

  async function getUser(code: string) {
    const { getExistingUser, discordUser, createUser } =
      await discordAuth.validateCallback(code)

    const existingUser = await getExistingUser()

    if (existingUser) return existingUser

    const avatar = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    const theme = await getThemeFromCookie()
    const user = await createUser({
      attributes: {
        username: discordUser.username,
        email: discordUser.email!,
        avatar: avatar,
        discord_id: discordUser.id,
        discord_username: discordUser.username,
        discord_metadata: JSON.stringify(discordUser),
        timestamp: new Date(),
        theme,
      },
    })

    const geo = getGeo(request)

    if (geo) {
      await Locations.create({
        userId: user.userId,
        geo,
      })
    }

    return user
  }

  try {
    const user = await getUser(code)
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })

    authRequest.setSession(session)

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