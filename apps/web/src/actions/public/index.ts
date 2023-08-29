"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { cookie, theme } from "~/lib/themes"
import { createAction } from "~/actions/zod"

export const changeTheme = createAction(z.nativeEnum(theme), async (theme) => {
  cookies().set(cookie, theme)
})
