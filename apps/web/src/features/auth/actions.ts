"use server"

import { invalidateSession } from "@artists-together/core/auth"
import {
  database,
  eq,
  UserSettings,
  userTable,
} from "@artists-together/core/database"
import { unreachable } from "@artists-together/core/utils"
import { deleteCookie, getCookie, setCookie } from "@standard-cookie/next"
import { generateState } from "arctic"
import { redirect } from "next/navigation"
import {
  cookieOauthOptions,
  cookieSessionOptions,
  getAuth,
  getUser,
  provider,
} from "~/features/auth/server"
import { getHints } from "~/features/hints/server"
import {
  AuthConnectionFormSchema,
  AuthFormSchema,
  UpdateProfileFormSchema,
} from "~/lib/schemas"
import { createFormAction } from "~/lib/server"

export async function authenticate() {
  return getUser()
}

export const login = createFormAction(AuthFormSchema, async (context) => {
  const cookieSession = await getCookie(cookieSessionOptions)

  if (cookieSession) {
    throw context.form.reply({
      formErrors: ["No need to do that again!"],
    })
  }

  const hints = await getHints()
  const state = generateState()
  const url = provider.discord.createAuthorizationURL(state, null, [
    "identify",
    "email",
  ])

  await setCookie(cookieOauthOptions, {
    pathname: context.form.value.pathname,
    state,
    hints: {
      fahrenheit: hints.temperatureUnit === "fahrenheit",
      fullHourFormat: hints.hourFormat === "24",
      geolocation: hints.geolocation,
    },
  })

  redirect(url.href)
})

export const logout = createFormAction(AuthFormSchema, async () => {
  const auth = await getAuth()

  if (!auth) return

  await invalidateSession(auth.session.id)
  await deleteCookie(cookieSessionOptions)
})

export const updateProfileSettings = createFormAction(
  UserSettings,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return {
        result: context.form.reply({
          formErrors: ["Unauthorized"],
        }),
      }
    }

    await database
      .update(userTable)
      .set({
        settings: context.form.value,
      })
      .where(eq(userTable.id, auth.user.id))
  },
)

export const updateProfile = createFormAction(
  UpdateProfileFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return {
        result: context.form.reply({
          formErrors: ["Unauthorized"],
        }),
      }
    }

    await database
      .update(userTable)
      .set(context.form.value)
      .where(eq(userTable.id, auth.user.id))
  },
)

export const connect = createFormAction(
  AuthConnectionFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return {
        result: context.form.reply({
          formErrors: ["Unauthorized"],
        }),
      }
    }

    const state = generateState()

    await setCookie(cookieOauthOptions, {
      pathname: context.form.value.pathname,
      state,
    })

    let url
    switch (context.form.value.provider) {
      case "discord":
        url = provider.discord.createAuthorizationURL(state, null, [
          "identify",
          "email",
        ])
        break
      case "twitch":
        url = provider.twitch.createAuthorizationURL(state, [])
        break
      default:
        unreachable(context.form.value.provider)
    }

    redirect(url.href)
  },
)

export const disconnect = createFormAction(
  AuthConnectionFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return {
        result: context.form.reply({
          formErrors: ["Unauthorized"],
        }),
      }
    }

    switch (context.form.value.provider) {
      case "discord":
        await database
          .update(userTable)
          .set({
            discordId: null,
            discordUsername: null,
            discordMetadata: null,
          })
          .where(eq(userTable.id, auth.user.id))
        break
      case "twitch":
        await database
          .update(userTable)
          .set({
            twitchId: null,
            twitchUsername: null,
            twitchMetadata: null,
          })
          .where(eq(userTable.id, auth.user.id))
        break
      default:
        unreachable(context.form.value.provider)
    }
  },
)
