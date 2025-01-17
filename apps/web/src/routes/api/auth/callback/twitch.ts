import * as v from "valibot"
import { createAPIFileRoute } from "@tanstack/start/api"
import { getCookie, getRequestURL } from "vinxi/http"
import { authenticate, cookieOauth, provider } from "~/services/auth/server"
import { AuthEndpointSearchParams } from "~/lib/schemas"
import { database, eq } from "@artists-together/core/database/client"
import {
  TwitchMetadata,
  userTable,
} from "@artists-together/core/database/schema"

export const APIRoute = createAPIFileRoute("/api/auth/callback/twitch")({
  async GET() {
    const cookie = cookieOauth.safeDecode(getCookie(cookieOauth.name))

    if (!cookie.success) {
      return new Response("Missing or invalid oauth cookie", {
        status: 400,
      })
    }

    const params = v.safeParse(
      AuthEndpointSearchParams,
      Object.fromEntries(getRequestURL().searchParams),
    )

    if (!params.success) {
      return new Response("Invalid params", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?error`,
        },
      })
    }

    if ("error" in params.output) {
      switch (params.output.error) {
        case "access_denied":
          return new Response("Access denied", {
            status: 307,
            headers: {
              Location: `${cookie.output.pathname}?modal=auth`,
            },
          })
        default:
          return new Response(params.output.error_description, {
            status: 307,
            headers: {
              Location: `${cookie.output.pathname}?error`,
            },
          })
      }
    }

    if (params.output.state !== cookie.output.state) {
      return new Response("OAuth state mismatch", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?error`,
        },
      })
    }

    const auth = await authenticate()

    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          Location: `${cookie.output.pathname}?error`,
        },
      })
    }

    try {
      const tokens = await provider.twitch.validateAuthorizationCode(
        params.output.code,
      )

      const twitchUser = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Client-Id": process.env.OAUTH_TWITCH_ID || "",
        },
      })
        .then((response) => response.json())
        .then((json) => v.parse(TwitchMetadata, json))

      await database
        .update(userTable)
        .set({
          twitchId: twitchUser.id,
          twitchUsername: twitchUser.login,
          twitchMetadata: twitchUser,
        })
        .where(eq(userTable.id, auth.user.id))

      return new Response("Updated Twitch user metadata", {
        status: 307,
        headers: {
          Location: `${cookie.output.pathname}?modal=auth`,
        },
      })
    } catch (error) {
      if (import.meta.env.DEV) {
        throw error
      }

      return new Response(
        error instanceof Error ? error.message : "Internal server error",
        {
          status: 307,
          headers: {
            Location: `${cookie.output.pathname}?error`,
          },
        },
      )
    }
  },
})
