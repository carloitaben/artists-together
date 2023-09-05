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
  region: z.string(),
})

export type Geo = z.infer<typeof Geo>

export const LocationsSelectSchema = createSelectSchema(locations)
export const LocationsInsertSchema = createInsertSchema(locations)

export type LocationsSelectSchema = z.infer<typeof LocationsSelectSchema>
export type LocationsInsertSchema = z.infer<typeof LocationsInsertSchema>

export const list = zod(z.void(), async () => db.select().from(locations))

export const create = zod(LocationsInsertSchema, async (location) => {
  const geo = Geo.parse(location.geo)
  await db.insert(locations).values({
    userId: location.userId,
    geo,
  })
})

export const remove = zod(LocationsSelectSchema.shape.id, async (id) => {
  await db.delete(locations).where(eq(locations.id, id))
})

export const removeFromUserId = zod(
  LocationsSelectSchema.shape.userId,
  async (userId) => {
    await db.delete(locations).where(eq(locations.userId, userId))
  }
)
