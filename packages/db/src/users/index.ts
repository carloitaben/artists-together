import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { user } from "./sql"

export const UserInsertSchema = createInsertSchema(user, {
  email: (schema) => schema.email.email(),
})

export type UserInsertSchema = z.infer<typeof UserInsertSchema>

export const UserSelectSchema = createSelectSchema(user, {
  email: (schema) => schema.email.email(),
})

export type UserSelectSchema = z.infer<typeof UserSelectSchema>

export type UserInsert = typeof user.$inferInsert

export type UserSelect = typeof user.$inferSelect
