import { eq } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { db } from "../db"
import { zod } from "../utils"
import { discordLiveUsers } from "./sql"

export const InsertSchema = createInsertSchema(discordLiveUsers, {
  url: (schema) => schema.url.url(),
})

export const SelectSchema = createSelectSchema(discordLiveUsers)

export type InsertSchema = z.infer<typeof InsertSchema>

export type SelectSchema = z.infer<typeof SelectSchema>

export const list = zod(z.void(), async () =>
  db.select().from(discordLiveUsers).all()
)

export const create = zod(
  InsertSchema.pick({ userId: true, url: true }),
  async (input) => {
    await db.insert(discordLiveUsers).values({
      userId: input.userId,
      url: input.url,
    })
  }
)

export const remove = zod(SelectSchema.shape.userId, async (userId) =>
  db
    .delete(discordLiveUsers)
    .where(eq(discordLiveUsers.userId, userId))
    .then(() => userId)
)
