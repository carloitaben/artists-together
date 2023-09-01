"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { auth } from "~/services/auth"
import { cookie, theme } from "~/lib/themes"
import { createAction } from "~/actions/zod"

export const changeTheme = createAction(z.nativeEnum(theme), async (theme) => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  cookies().set(cookie, theme)

  if (session) {
    await auth.updateUserAttributes(session.user.userId, { theme })
  }
})
