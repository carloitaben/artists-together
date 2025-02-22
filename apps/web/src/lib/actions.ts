"use server"

import { deleteCookie, getCookie, setCookie } from "@standard-cookie/next"
import { database, eq, userTable } from "@artists-together/core/database"
import { invalidateSession } from "@artists-together/core/auth"
import { discord, CHANNEL } from "@artists-together/core/discord"
import { unreachable } from "@artists-together/core/utils"
import { generateState } from "arctic"
import { redirect } from "next/navigation"
import { getHints } from "~/services/hints/server"
import {
  cookieOauthOptions,
  cookieSessionOptions,
  getAuth,
  provider,
} from "~/services/auth/server"
import { createFormAction } from "~/lib/server"
import {
  AuthFormSchema,
  AuthConnectionFormSchema,
  ContactSupportFormSchema,
  UpdateProfileFormSchema,
} from "~/lib/schemas"

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
      .set({
        links: context.form.value.links,
      })
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

export const contactSupport = createFormAction(
  ContactSupportFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      return {
        result: context.form.reply({
          formErrors: ["Unauthorized"],
        }),
      }
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

    return {
      message: "Message sent!",
      result: context.form.reply({
        resetForm: true,
      }),
    }
  },
)
