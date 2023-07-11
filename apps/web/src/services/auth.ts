import "server-only"
import { and, connect, createConnection, eq, otp } from "db"
import { cookies } from "next/headers"
import { lucia } from "lucia"
import { nextjs } from "lucia/middleware"
import { generateRandomString, isWithinExpiration } from "lucia/utils"
import { planetscale } from "@lucia-auth/adapter-mysql"

const connection = createConnection({
  fetch,
})

export const auth = lucia({
  adapter: planetscale(connection, {
    key: "auth_key",
    session: "auth_session",
    user: "auth_user",
  }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs(),
  getUserAttributes: (user) => user,
  sessionCookie: {
    expires: false,
  },
})

export type Auth = typeof auth

const EXPIRES_IN_MS = 5 * 60 * 1000

export async function generateOneTimePassword(userId: string) {
  const db = connect()
  await db.delete(otp).where(eq(otp.userId, userId))

  const token = generateRandomString(6).toUpperCase()
  await db.insert(otp).values({
    expires: new Date().getTime() + EXPIRES_IN_MS,
    password: token, // optionally hash it for added security,
    userId,
  })

  return token
}

export async function validateOneTimePassword(
  userId: string,
  password: string
) {
  const db = connect()

  const [storedPassword] = await db
    .select()
    .from(otp)
    .where(and(eq(otp.userId, userId), eq(otp.password, password)))
    .limit(1)

  if (!storedPassword) {
    throw new Error("Invalid password")
  }

  await db.delete(otp).where(eq(otp.id, storedPassword.id))

  if (!isWithinExpiration(storedPassword.expires)) {
    throw new Error("Expired password")
  }

  return storedPassword.userId
}

export async function getSession() {
  return auth.handleRequest({ request: null, cookies }).validate()
}
