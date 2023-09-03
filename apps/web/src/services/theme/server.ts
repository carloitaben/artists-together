import "server-only"
import { cookies } from "next/headers"
import { getSession } from "~/services/auth"
import { cookieName, theme, defaultTheme } from "./utils"

export async function getThemeFromCookie() {
  const cookieStore = cookies()
  const cookieValue = cookieStore.get(cookieName)?.value

  if (cookieValue) {
    const result = theme.safeParse(cookieValue)
    if (result.success) return result.data
  }

  const session = await getSession()

  if (session) {
    const result = theme.safeParse(session.user.theme)
    if (result.success) return result.data
  }

  return defaultTheme
}
