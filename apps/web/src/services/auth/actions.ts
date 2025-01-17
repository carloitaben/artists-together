import { invalidateSession } from "@artists-together/core/auth"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { parseWithValibot } from "conform-to-valibot"
import { generateState } from "arctic"
import { AuthFormSchema } from "~/lib/schemas"
import { $hints } from "~/services/hints/server"
import { authenticate, cookieOauth, cookieSession, provider } from "./server"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"

export const $authenticate = createServerFn({ method: "GET" }).handler(
  async () => authenticate(),
)

export const $login = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    const form = parseWithValibot(data, {
      schema: AuthFormSchema,
    })

    if (form.status !== "success") {
      throw form.reply()
    }

    if (cookieSession.safeDecode(getCookie(cookieSession.name)).success) {
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

    setCookie(
      cookieOauth.name,
      cookieOauth.encode({
        fahrenheit: hints.temperatureUnit === "fahrenheit",
        fullHourFormat: hints.hourFormat === "24",
        pathname: form.value.pathname,
        geolocation: hints.geolocation,
        state,
      }),
      cookieOauth.options,
    )

    throw redirect({
      href: url.href,
    })
  })

export const $logout = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    const parsed = parseWithValibot(data, {
      schema: AuthFormSchema,
    })

    if (parsed.status !== "success") {
      throw parsed.reply()
    }

    const auth = await authenticate()

    if (!auth) {
      throw Error("Unauthorized")
    }

    invalidateSession(auth.session.id)
    deleteCookie(cookieSession.name, cookieSession.options)
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
