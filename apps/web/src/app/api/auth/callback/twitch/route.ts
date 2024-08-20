import { provider } from "@artists-together/auth"
import { db, eq, twitchMetadata, users } from "@artists-together/db"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { parseSearchParams } from "~/lib/server"
import { authenticate, oauthCookie } from "~/services/auth/server"

const searchParams = z.union([
  z.object({
    error: z.string(),
    error_description: z.string().optional(),
  }),
  z.object({
    code: z.string().min(1),
    state: z.string().min(1),
  }),
])

export async function GET(request: NextRequest) {
  const cookie = oauthCookie.get()

  if (!cookie.success) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing or invalid oauth cookie",
    })
  }

  const params = parseSearchParams(request.nextUrl.searchParams, searchParams)

  if (!params.success) {
    return redirect(`${cookie.data.pathname}?error`)
  }

  if ("error" in params.data) {
    switch (params.data.error) {
      case "access_denied":
        return redirect(`${cookie.data.pathname}?modal=auth`)
      default:
        return redirect(`${cookie.data.pathname}?error`)
    }
  }

  if (params.data.state !== cookie.data.state) {
    return redirect(`${cookie.data.pathname}?error`)
  }

  const auth = await authenticate()

  if (!auth) {
    return redirect(`${cookie.data.pathname}?error`)
  }

  try {
    const tokens = await provider.twitch.validateAuthorizationCode(
      params.data.code,
    )

    const twitchUser = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Client-Id": import.meta.env.TWITCH_OAUTH_ID || "",
      },
    })
      .then((response) => response.json())
      .then(twitchMetadata.parse)

    await db
      .update(users)
      .set({
        twitchId: twitchUser.id,
        twitchUsername: twitchUser.login,
        twitchMetadata: twitchUser,
      })
      .where(eq(users.id, auth.user.id))

    return redirect(`${cookie.data.pathname}?modal=auth`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    console.error(error)
    return redirect(`${cookie.data.pathname}?error`)
  }
}
