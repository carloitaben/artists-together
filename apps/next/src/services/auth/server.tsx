import "server-only"
import type { AuthenticateResult } from "@artists-together/auth"
import { lucia, authenticate as doAuthenticate } from "@artists-together/auth"
import type { ReactNode } from "react"
import { cache } from "react"
import { cookies } from "next/headers"
import { z } from "zod"
import { geolocationSchema } from "~/lib/headers/server"
import { createCookie } from "~/lib/cookies"
import { pathnameSchema } from "~/lib/schemas"
import { AuthProvider as AuthProviderClient } from "./client"

export const oauthCookie = createCookie(
  "oauth",
  z.object({
    geolocation: geolocationSchema,
    pathname: pathnameSchema,
    state: z.string(),
  }),
  {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  },
)

export const authenticate = cache(async (): Promise<AuthenticateResult> => {
  const cookie = cookies().get(lucia.sessionCookieName)?.value
  const result = await doAuthenticate(cookie)

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result?.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }

    if (!result?.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch {}

  return result?.user && result?.session ? result : null
})

export async function AuthContext({ children }: { children: ReactNode }) {
  const auth = await authenticate()

  return (
    <AuthProviderClient value={auth?.user || null}>
      {children}
    </AuthProviderClient>
  )
}
