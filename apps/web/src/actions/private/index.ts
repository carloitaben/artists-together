"use server"

import { privateAction } from "~/actions/client"
import { logoutSchema } from "~/actions/schemas"

export const demo = privateAction(logoutSchema, async (data, context) => {
  console.log(`user ${context.userId} wants to delete thing`)

  return {
    sucess: true,
  }
})
