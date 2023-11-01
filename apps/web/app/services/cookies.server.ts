import { createCookie, createCookieSessionStorage } from "@remix-run/node"
import { createTypedCookie } from "remix-utils/typed-cookie"
import { z } from "zod"
import { theme, defaultTheme } from "~/lib/themes"

const secret = import.meta.env.DEV ? "s3cr3t" : process.env.AUTH_SECRET

if (import.meta.env.PROD && !secret) {
  throw Error("Missing AUTH_SECRET environment variable")
}

export const session = createCookieSessionStorage({
  cookie: {
    name: "session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [String(secret)],
    secure: process.env.NODE_ENV === "production",
  },
})

export const themeCookie = createTypedCookie({
  cookie: createCookie("theme"),
  schema: theme,
})

export const fromCookieSchema = z.string().nullable()

export const fromCookie = createTypedCookie({
  cookie: createCookie("from"),
  schema: fromCookieSchema,
})

export async function getTheme(request: Request) {
  const cookieHeader = request.headers.get("Cookie")
  const theme = await themeCookie.parse(cookieHeader)
  return theme || defaultTheme
}
