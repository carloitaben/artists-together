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
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
})

export type Auth = typeof auth

export const otpToken = passwordToken(auth, "otp", {
  expiresIn: 15 * 60, // 15 minutes
  generate: () => generateRandomString(6, "0123456789"),
})

export async function getOrCreateValidOtp(id: string) {
  const existingOtp = await otpToken.getUserTokens(id).then((tokens) => tokens.find((token) => !token.expired))
  if (existingOtp) return existingOtp
  return otpToken.issue(id)
}

export async function getSession() {
  const authRequest = auth.handleRequest({ cookies })
  return authRequest.validateUser()
}