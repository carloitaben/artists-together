"use server"

import { authenticator } from "@artists-together/core/auth"
import { database, eq, userTable } from "@artists-together/core/database"
import { parseWithZod } from "@conform-to/zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { generateState } from "arctic"
import { geolocation } from "~/lib/headers/server"
import { error } from "~/lib/server"
import { authenticate, oauthCookie, provider } from "./server"
import { updateSchema } from "./shared"

export async function login(pathname: string) {
  const auth = await authenticate()

  if (auth.session) {
    return error({ cause: "ALREADY_LOGGED_IN" })
  }

  const state = generateState()
  const geo = geolocation()
  const url = provider.discord.createAuthorizationURL(state, [
    "identify",
    "email",
  ])

  oauthCookie.set(
    {
      geolocation: geo,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.href)
}

export async function logout() {
  const auth = await authenticate()

  if (!auth.session) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await authenticator.invalidateSession(auth.session.id)
  const sessionCookie = authenticator.createBlankSessionCookie()

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.npmCookieOptions(),
  )
}

export async function update(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: updateSchema,
  })

  console.log(submission)

  if (submission.status !== "success") {
    return submission.reply()
  }

  const auth = await authenticate()

  if (!auth.user) {
    return submission.reply({
      formErrors: ["Unauthorized"],
    })
  }

  console.log(`update user ${auth.user.id} with:`, submission.value)

  try {
    await database
      .update(userTable)
      .set(submission.value)
      .where(eq(userTable.id, auth.user.id))
  } catch (error) {
    console.error(error)
    return submission.reply({
      formErrors: ["Oops! Something went wrong…"],
    })
  }
}

export async function connectDiscord(pathname: string) {
  const auth = await authenticate()

  if (!auth) {
    return error({ cause: "UNAUTHORIZED" })
  }

  const state = generateState()
  const url = provider.discord.createAuthorizationURL(state, [
    "identify",
    "email",
  ])

  oauthCookie.set(
    {
      geolocation: null,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.href)
}

export async function unlinkDiscord() {
  const auth = await authenticate()

  if (!auth.user) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await database
    .update(userTable)
    .set({
      discordId: null,
      discordUsername: null,
      discordMetadata: null,
    })
    .where(eq(userTable.id, auth.user.id))
}

export async function connectTwitch(pathname: string) {
  const auth = await authenticate()

  if (!auth.user) {
    return error({ cause: "UNAUTHORIZED" })
  }

  const state = generateState()
  const url = provider.twitch.createAuthorizationURL(state, [])

  oauthCookie.set(
    {
      geolocation: null,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.href)
}

export async function unlinkTwitch() {
  const auth = await authenticate()

  if (!auth.user) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await database
    .update(userTable)
    .set({
      twitchId: null,
      twitchUsername: null,
      twitchMetadata: null,
    })
    .where(eq(userTable.id, auth.user.id))
}
