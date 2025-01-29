"use server"

import { database, eq, userTable } from "@artists-together/core/database"
import { invalidateSession } from "@artists-together/core/auth"
import { discord, CHANNEL } from "@artists-together/core/discord"
import { generateState } from "arctic"
import { redirect } from "next/navigation"
import { getHints } from "~/services/hints/server"
import {
  getAuth,
  getCookieOauth,
  getCookieSession,
  provider,
} from "~/services/auth/server"
import { createFormAction } from "~/lib/server"
import {
  AuthFormSchema,
  AuthConnectionFormSchema,
  ContactSupportFormSchema,
  UpdateProfileFormSchema,
} from "~/lib/schemas"
import { unreachable } from "@artists-together/core/utils"

export const login = createFormAction(AuthFormSchema, async (context) => {
  const cookieSession = await getCookieSession()

  if (cookieSession.get().success) {
    return context.form.reply({
      formErrors: ["No need to do that again!"],
    })
  }

  const cookieOauth = await getCookieOauth()
  const hints = await getHints()
  const state = generateState()
  const url = provider.discord.createAuthorizationURL(state, null, [
    "identify",
    "email",
  ])

  cookieOauth.set({
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

  const cookieSession = await getCookieSession()
  await invalidateSession(auth.session.id)
  cookieSession.delete()
})

export const updateProfile = createFormAction(
  UpdateProfileFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return context.form.reply({
        formErrors: ["Unauthorized"],
      })
    }

    await database
      .update(userTable)
      .set({
        bio: context.form.value.bio,
      })
      .where(eq(userTable.id, auth.user.id))
  },
)

export const connect = createFormAction(
  AuthConnectionFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return context.form.reply({
        formErrors: ["Unauthorized"],
      })
    }

    const cookieOauth = await getCookieOauth()
    const state = generateState()

    cookieOauth.set({
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
      return context.form.reply({
        formErrors: ["Unauthorized"],
      })
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

export const contactSupport = createFormAction(
  ContactSupportFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return context.form.reply({
        formErrors: ["Unauthorized"],
      })
    }

    await discord.channels.createMessage(CHANNEL.BOT_SHENANIGANS, {
      content: "Heads up! Received a contact form submission",
      embeds: [
        {
          fields: [
            {
              name: "User",
              value:
                auth.user.discordUsername ||
                auth.user.email ||
                String(auth.user.id),
              inline: false,
            },
            {
              name: "Subject",
              value: context.form.value.subject,
              inline: false,
            },
            {
              name: "Message",
              value: context.form.value.message,
              inline: false,
            },
          ],
        },
      ],
    })
  },
)
