import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { db } from "../db"
import { keepAliveDummies } from "./sql"

export const schema = createSelectSchema(keepAliveDummies)

export type Schema = z.infer<typeof schema>

/**
 * PlanetScale deactivates databases without activity.
 * In the Discord bot deployment we write daily to this table
 * to prevent deactivation
 */
export const poke = async () => {
  console.log("[keep-alive] Poking db")
  await db.insert(keepAliveDummies).values({})
  await db.delete(keepAliveDummies)
  console.log("[keep-alive] Poked successfully")
}
