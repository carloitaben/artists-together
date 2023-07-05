import { userSchema } from "db"
import { z } from "zod"

export const loginSchema = userSchema.pick({ email: true })

export const signupSchema = userSchema.pick({ username: true, email: true })

export const verifySchema = userSchema.pick({ email: true }).extend({
  otp: z.string().length(6),
})
