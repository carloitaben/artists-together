import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { db } from "../db"
import { zod } from "../zod"
import { keepAliveDummies } from "./sql"

export const schema = createSelectSchema(keepAliveDummies)

export type Schema = z.infer<typeof schema>

export const poke = zod(z.void(), async () => {
  await db.insert(keepAliveDummies).values({})
  await db.delete(keepAliveDummies)
})
