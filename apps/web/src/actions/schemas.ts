import { userSchema } from "db"
import { z } from "zod"

export const loginSchema = userSchema.pick({ email: true })

export const registerSchema = userSchema.pick({ username: true, email: true })

export const verifySchema = userSchema.pick({ email: true }).extend({
  otp: z.string().length(6),
})

export const logoutSchema = z.object({})
