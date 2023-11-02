import { createCookie } from "@remix-run/node"
import type { TypedCookie } from "remix-utils/typed-cookie"
import { createTypedCookie } from "remix-utils/typed-cookie"
import type { ZodTypeAny } from "zod"
import { z } from "zod"
import { theme } from "~/lib/themes"

export const themeCookie = createTypedCookie({
  cookie: createCookie("theme"),
  schema: theme,
})

export const oauthCookieSchema = z
  .object({
    intent: z.union([z.literal("connect"), z.literal("login")]),
    from: z.string(),
    state: z.string(),
  })
  .nullable()

export const oauthCookie = createTypedCookie({
  cookie: createCookie("oauth"),
  schema: oauthCookieSchema,
})

export async function getCookie<T extends ZodTypeAny>(
  request: Request,
  cookie: TypedCookie<T>,
) {
  const cookieHeader = request.headers.get("Cookie")
  return cookie.parse(cookieHeader)
}
