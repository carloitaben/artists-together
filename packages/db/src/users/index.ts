import { eq } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { users } from "./sql"
import { zod, asset } from "../utils"
import { db } from "../db"

export const UsersInsertSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  links: z.array(z.string().url()),
})

export type UsersInsertSchema = z.infer<typeof UsersInsertSchema>

export const UsersSelectSchema = createSelectSchema(users, {
  email: (schema) => schema.email.email(),
  links: z.array(z.string().url()),
  avatar: asset,
})

export type UsersSelectSchema = z.infer<typeof UsersSelectSchema>

export const fromUsername = zod(
  UsersSelectSchema.shape.username,
  async (username) =>
    db.select().from(users).where(eq(users.username, username)).get()
)

export const fromEmail = zod(UsersSelectSchema.shape.email, async (email) =>
  db.select().from(users).where(eq(users.email, email)).get()
)
