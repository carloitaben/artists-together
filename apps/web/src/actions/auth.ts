"use server"

import * as context from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createAction, serverError } from "~/actions/zod"
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
    const cookieStore = context.cookies()

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
      },
    )

    return redirect(url.toString())
  },
)

export const unlinkDiscordSSO = createAction(z.void(), async () => {
  const request = auth.handleRequest("POST", context)
  const session = await request.validate()

  if (!session) return serverError("UNAUTHORIZED")
  if (!session.user.discord_id) return serverError("NOT_LINKED")

  return auth.updateUserAttributes(session.user.userId, {
    discord_id: null,
    discord_metadata: null,
    discord_username: null,
  })
})

export const twitchSSO = createAction(
  OAuthCookieStateSchema.pick({ pathname: true }),
  async ({ pathname }) => {
    const [url, state] = await twitchAuth.getAuthorizationUrl()
    const cookieStore = context.cookies()

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
      },
    )

    return redirect(url.toString())
  },
)

export const unlinkTwitchSSO = createAction(z.void(), async () => {
  const request = auth.handleRequest("POST", context)
  const session = await request.validate()

  if (!session) return serverError("UNAUTHORIZED")
  if (!session.user.twitch_id) return serverError("NOT_LINKED")

  return auth.updateUserAttributes(session.user.userId, {
    twitch_id: null,
    twitch_metadata: null,
    twitch_username: null,
  })
})

export const logout = createAction(z.void(), async () => {
  const request = auth.handleRequest("POST", context)
  const session = await request.validate()

  if (!session) return serverError("UNAUTHORIZED")

  await auth.invalidateSession(session.sessionId)
  return request.setSession(null)
})

export const removeAccount = createAction(z.void(), async () => {
  const request = auth.handleRequest("POST", context)
  const session = await request.validate()

  if (!session) return serverError("UNAUTHORIZED")

  await auth.invalidateSession(session.sessionId)
  await auth.deleteUser(session.user.userId)
  return request.setSession(null)
})
