import { userSchema } from "db"

export const loginSchema = userSchema.pick({ email: true })

export const signupSchema = userSchema.pick({ username: true, email: true })
