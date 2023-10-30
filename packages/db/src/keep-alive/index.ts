import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { db } from "../db"
import { zod } from "../utils"
import { keepAliveDummies } from "./sql"

export const InsertSchema = createInsertSchema(keepAliveDummies)

export const SelectSchema = createSelectSchema(keepAliveDummies)

export type InsertSchema = z.infer<typeof SelectSchema>

export type SelectSchema = z.infer<typeof SelectSchema>

export const poke = zod(z.void(), async () => {
  await db.insert(keepAliveDummies).values({})
  await db.delete(keepAliveDummies)
})
