import { eq } from "drizzle-orm"
import { z } from "zod"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { zod } from "../utils"
import { db } from "../db"
import { locations } from "./sql"

export const Geo = z.object({
  latitude: z.string(),
  longitude: z.string(),
  country: z.string(),
  city: z.string(),
  timezone: z.string(),
})

export type Geo = z.infer<typeof Geo>

export const SelectSchema = createSelectSchema(locations, {
  geo: () => Geo,
})

export const InsertSchema = createInsertSchema(locations, {
  geo: () => Geo,
})

export type SelectSchema = z.infer<typeof SelectSchema>
export type InsertSchema = z.infer<typeof InsertSchema>

export const list = zod(z.void(), async () => db.select().from(locations))

export const create = zod(InsertSchema, async (location) => {
  await db.insert(locations).values(location)
})

export const remove = zod(SelectSchema.shape.id, async (id) =>
  db
    .delete(locations)
    .where(eq(locations.id, id))
    .then(() => id)
)

export const removeFromUserId = zod(SelectSchema.shape.userId, async (userId) =>
  db
    .delete(locations)
    .where(eq(locations.userId, userId))
    .then(() => userId)
)
