"use server"

import { cookies } from "next/headers"
import { auth, getSession } from "~/services/auth"
import { cookieName, theme } from "~/services/theme"
import { createAction } from "~/actions/zod"

export const changeTheme = createAction(theme, async (theme) => {
  cookies().set(cookieName, theme)

  const session = await getSession()

  if (session) {
    await auth.updateUserAttributes(session.user.userId, { theme })
  }
})
