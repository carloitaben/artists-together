import { unsealData } from "iron-session"
import { cookies } from "next/headers"

type User = {
  isLoggedIn: boolean
  login: string
  avatarUrl: string
}

type Cookies = ReturnType<typeof cookies>

/**
 * Can be called in page/layout server component.
 * @param cookies ReadonlyRequestCookies
 * @returns SessionUser or null
 */
export async function getRequestCookie(cookies: Cookies): Promise<User | null> {
  const found = cookies.get("_session")

  if (!found) return null

  const { user } = await unsealData(found.value, {
    password: (process.env.SECRET_COOKIE_PASSWORD as string) || "2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8",
  })

  return user as unknown as User
}
