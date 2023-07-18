"use server"

import { action } from "~/actions/client"
import { loginSchema } from "~/actions/schemas"

export const demo = action(loginSchema, async (data) => {
  console.log(data)

  return {
    sucess: true,
  }
})
