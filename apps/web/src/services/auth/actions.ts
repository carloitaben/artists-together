"use server"

import { generateState, lucia, provider } from "@artists-together/auth"
import { db, eq, users } from "@artists-together/db"
import { parseWithZod } from "@conform-to/zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { geolocation } from "~/lib/headers/server"
import { error } from "~/lib/server"
import { authenticate, oauthCookie } from "./server"
import { updateSchema } from "./shared"

export async function login(pathname: string) {
  const auth = await authenticate()

  if (auth) {
    return error({ cause: "ALREADY_LOGGED_IN" })
  }

  const state = generateState()
  const geo = geolocation()
  const url = await provider.discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  })

  oauthCookie.set(
    {
      geolocation: geo,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.toString())
}

export async function logout() {
  const auth = await authenticate()

  if (!auth) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await lucia.invalidateSession(auth.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
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

  if (!auth) {
    return submission.reply({
      formErrors: ["Unauthorized"],
    })
  }

  console.log(`update user ${auth.user.id} with:`, submission.value)

  try {
    await db
      .update(users)
      .set(submission.value)
      .where(eq(users.id, auth.user.id))
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
  const url = await provider.discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  })

  oauthCookie.set(
    {
      geolocation: null,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.toString())
}

export async function unlinkDiscord() {
  const auth = await authenticate()

  if (!auth) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await db
    .update(users)
    .set({
      discordId: null,
      discordUsername: null,
      discordMetadata: null,
    })
    .where(eq(users.id, auth.user.id))
}

export async function connectTwitch(pathname: string) {
  const auth = await authenticate()

  if (!auth) {
    return error({ cause: "UNAUTHORIZED" })
  }

  const state = generateState()
  const url = await provider.twitch.createAuthorizationURL(state)

  oauthCookie.set(
    {
      geolocation: null,
      pathname,
      state,
    },
    { strict: true },
  )

  return redirect(url.toString())
}

export async function unlinkTwitch() {
  const auth = await authenticate()

  if (!auth) {
    return error({ cause: "UNAUTHORIZED" })
  }

  await db
    .update(users)
    .set({
      twitchId: null,
      twitchUsername: null,
      twitchMetadata: null,
    })
    .where(eq(users.id, auth.user.id))
}
