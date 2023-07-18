"use server"

import { cookies } from "next/headers"

import { action } from "~/actions/client"
import { changeThemeSchema, loginSchema } from "~/actions/schemas"
import { cookie } from "~/lib/themes"

export const demo = action(loginSchema, async (data) => {
  console.log(data)

  return {
    sucess: true,
  }
})

export const changeTheme = action(changeThemeSchema, async (theme) => {
  cookies().set(cookie, theme)
})
