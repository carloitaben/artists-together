"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createAction } from "~/actions/zod"
import {
  auth,
  discordAuth,
  twitchAuth,
  OAuthCookieStateSchema,
  encodeOAuthCookieState,
} from "~/services/auth"

export const discordSSO = createAction(
  OAuthCookieStateSchema.pick({ pathname: true }),
  async ({ pathname }) => {
    const [url, state] = await discordAuth.getAuthorizationUrl()
    const cookieStore = cookies()

    cookieStore.set(
      "discord_oauth_state",
      encodeOAuthCookieState({
        state,
        pathname,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      }
    )

    return redirect(url.toString())
  }
)

export const twitchSSO = createAction(
  OAuthCookieStateSchema.pick({ pathname: true }),
  async ({ pathname }) => {
    const [url, state] = await twitchAuth.getAuthorizationUrl()
    const cookieStore = cookies()

    cookieStore.set(
      "twitch_oauth_state",
      encodeOAuthCookieState({
        state,
        pathname,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      }
    )

    return redirect(url.toString())
  }
)

export const logout = createAction(z.void(), async () => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  if (!session) return

  await auth.invalidateSession(session.sessionId)
  return request.setSession(null)
})
