import {
  database,
  userTable,
  eq,
  TwitchMetadata,
} from "@artists-together/core/database"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { authenticate, oauthCookie, provider } from "~/services/auth/server"
import { parseSearchParams } from "~/lib/server"

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

  oauthCookie.delete()

  const params = parseSearchParams(request.nextUrl.searchParams, {
    schema: searchParams,
  })

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
        "Client-Id": process.env.OAUTH_TWITCH_ID || "",
      },
    })
      .then((response) => response.json())
      .then(TwitchMetadata.parse)

    await database
      .update(userTable)
      .set({
        twitchId: twitchUser.id,
        twitchUsername: twitchUser.login,
        twitchMetadata: twitchUser,
      })
      .where(eq(userTable.id, auth.user.id))

    return redirect(`${cookie.data.pathname}?modal=auth`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    console.error(error)
    return redirect(`${cookie.data.pathname}?error`)
  }
}
