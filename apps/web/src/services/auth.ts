import lucia from "lucia-auth"
import { cookies } from "next/headers"
import { generateRandomString } from "lucia-auth"
import { nextjs } from "lucia-auth/middleware"
import { planetscale } from "@lucia-auth/adapter-mysql"
import { passwordToken } from "@lucia-auth/tokens"
import { createConnection } from "db"

const connection = createConnection()

export const auth = lucia({
  adapter: planetscale(connection),
  middleware: nextjs(),
  transformDatabaseUser: (user) => user,
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
})

export type Auth = typeof auth

export const otpToken = passwordToken(auth, "otp", {
  expiresIn: 5 * 60, // 5 minutes
  generate: () =>
    generateRandomString(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
})

export async function getOtp(id: string) {
  const existingOtp = await otpToken
    .getUserTokens(id)
    .then((tokens) => tokens.find((token) => !token.expired))

  return existingOtp || otpToken.issue(id)
}

export async function getAuth() {
  const authRequest = auth.handleRequest({ cookies })
  return authRequest.validateUser()
}

export async function getUser() {
  const auth = await getAuth()
  return auth.user
}

export type User = Awaited<ReturnType<typeof getUser>>
