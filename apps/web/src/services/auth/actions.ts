import type { SessionValidationResult } from "@artists-together/core/auth"
import { invalidateSession } from "@artists-together/core/auth"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { parseWithZod } from "@conform-to/zod"
import { getEvent } from "vinxi/http"
import { generateState } from "arctic"
import { AuthFormSchema } from "~/lib/schemas"
import { $hints } from "~/services/hints/server"
import { authenticate, cookieOauth, cookieSession, provider } from "./server"

export const $authenticate = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionValidationResult> => {
    const event = getEvent()
    return authenticate(event)
  },
)

export const $login = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    const form = parseWithZod(data, {
      schema: AuthFormSchema,
    })

    if (form.status !== "success") {
      throw form.reply()
    }

    const event = getEvent()

    if (cookieSession.has(event)) {
      throw form.reply({
        formErrors: ["Already logged in"],
      })
    }

    const hints = await $hints()
    const state = generateState()
    const url = provider.discord.createAuthorizationURL(state, null, [
      "identify",
      "email",
    ])

    cookieOauth.set(event, {
      fahrenheit: hints.temperatureUnit === "fahrenheit",
      fullHourFormat: hints.hourFormat === "24",
      pathname: form.value.pathname,
      geolocation: hints.geolocation,
      state,
    })

    throw redirect({
      href: url.href,
    })
  })

export const $logout = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    const parsed = parseWithZod(data, {
      schema: AuthFormSchema,
    })

    if (parsed.status !== "success") {
      throw parsed.reply()
    }

    const event = getEvent()
    const auth = await authenticate(event)

    if (!auth) {
      throw Error("Unauthorized")
    }

    invalidateSession(auth.session.id)
    cookieSession.delete(getEvent())
  })

export const $linkDiscord = createServerFn({ method: "GET" }).handler(
  async () => {},
)

export const $linkTwitch = createServerFn({ method: "GET" }).handler(
  async () => {},
)

export const $unlinkDiscord = createServerFn({ method: "GET" }).handler(
  async () => {},
)

export const $unlinkTwitch = createServerFn({ method: "GET" }).handler(
  async () => {},
)

// export async function update(_: unknown, formData: FormData) {
//   const submission = parseWithZod(formData, {
//     schema: updateSchema,
//   })

//   console.log(submission)

//   if (submission.status !== "success") {
//     return submission.reply()
//   }

//   const auth = await authenticate()

//   if (!auth) {
//     return submission.reply({
//       formErrors: ["Unauthorized"],
//     })
//   }

//   console.log(`update user ${auth.user.id} with:`, submission.value)

//   // try {
//   //   await database
//   //     .update(userTable)
//   //     .set(submission.value)
//   //     .where(eq(userTable.id, auth.user.id))
//   // } catch (error) {
//   //   console.error(error)
//   //   return submission.reply({
//   //     formErrors: ["Oops! Something went wrong…"],
//   //   })
//   // }
// }

// export async function connectDiscord(pathname: string) {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   const state = generateState()
//   const url = provider.discord.createAuthorizationURL(state, [
//     "identify",
//     "email",
//   ])

//   oauthCookie.set(
//     {
//       geolocation: null,
//       pathname,
//       state,
//     },
//     { strict: true },
//   )

//   return redirect(url.href)
// }

// export async function unlinkDiscord() {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   await database
//     .update(userTable)
//     .set({
//       discordId: null,
//       discordUsername: null,
//       discordMetadata: null,
//     })
//     .where(eq(userTable.id, auth.user.id))
// }

// export async function connectTwitch(pathname: string) {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   const state = generateState()
//   const url = provider.twitch.createAuthorizationURL(state, [])

//   oauthCookie.set(
//     {
//       geolocation: null,
//       pathname,
//       state,
//     },
//     { strict: true },
//   )

//   return redirect(url.href)
// }

// export async function unlinkTwitch() {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   await database
//     .update(userTable)
//     .set({
//       twitchId: null,
//       twitchUsername: null,
//       twitchMetadata: null,
//     })
//     .where(eq(userTable.id, auth.user.id))
// }
