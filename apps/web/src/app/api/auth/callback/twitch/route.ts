import { database, eq, userTable } from "@artists-together/core/database"
import { deleteCookie, getCookie } from "@standard-cookie/next"
import type { NextRequest } from "next/server"
import * as v from "valibot"
import { cookieOauthOptions, getAuth, provider } from "~/features/auth/server"
import {
  AuthEndpointSearchParams,
  AuthEndpointTwitchResponseSchema,
} from "~/lib/schemas"

export async function GET(request: NextRequest) {
  const cookieOauth = await getCookie(cookieOauthOptions)
  await deleteCookie(cookieOauthOptions)

  if (!cookieOauth) {
    return new Response(
      `Missing or invalid "${cookieOauthOptions.name}" cookie`,
      {
        status: 400,
      },
    )
  }

  const params = v.safeParse(
    AuthEndpointSearchParams,
    Object.fromEntries(request.nextUrl.searchParams),
  )

  if (!params.success) {
    return new Response("Invalid params", {
      status: 307,
      headers: {
        Location: `${cookieOauth.pathname}?error`,
      },
    })
  }

  if ("error" in params.output) {
    switch (params.output.error) {
      case "access_denied":
        return new Response("Access denied", {
          status: 307,
          headers: {
            Location: `${cookieOauth.pathname}?modal=auth`,
          },
        })
      default:
        return new Response(params.output.error_description, {
          status: 307,
          headers: {
            Location: `${cookieOauth.pathname}?error`,
          },
        })
    }
  }

  if (params.output.state !== cookieOauth.state) {
    return new Response("OAuth state mismatch", {
      status: 307,
      headers: {
        Location: `${cookieOauth.pathname}?error`,
      },
    })
  }

  const auth = await getAuth()

  if (!auth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        Location: `${cookieOauth.pathname}?error`,
      },
    })
  }

  try {
    const tokens = await provider.twitch.validateAuthorizationCode(
      params.output.code,
    )

    const twitchUser = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        "Client-Id": String(process.env.OAUTH_TWITCH_ID),
      },
    })
      .then((response) => response.json())
      .then((data) => v.parse(AuthEndpointTwitchResponseSchema, data))
      .then((data) => data.data[0])

    await database
      .update(userTable)
      .set({
        twitchId: twitchUser.id,
        twitchUsername: twitchUser.login,
        twitchMetadata: twitchUser,
      })
      .where(eq(userTable.id, auth.user.id))

    return new Response("Connected successfully", {
      status: 307,
      headers: {
        Location: `${cookieOauth.pathname}?modal=auth`,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      throw error
    }

    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      {
        status: 307,
        headers: {
          Location: `${cookieOauth.pathname}?error`,
        },
      },
    )
  }
}
