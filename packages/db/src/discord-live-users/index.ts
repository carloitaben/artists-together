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

export const list = zod(z.void(), async () => db.select().from(discordLiveUsers).all())

export const create = zod(
  InsertSchema.pick({ userId: true, url: true }),
  async (input) => {
    console.log("[discord-live-users] adding", input)

    return db
      .insert(discordLiveUsers)
      .values({
        userId: input.userId,
        url: input.url,
      })
      .returning({
        id: discordLiveUsers.id,
        userId: discordLiveUsers.userId,
        url: discordLiveUsers.url,
      })
      .get()
  }
)

export const update = zod(
  SelectSchema.pick({ userId: true, url: true }),
  async (input) => {
    console.log("[discord-live-users] updating", input)

    await db
      .update(discordLiveUsers)
      .set({
        userId: input.userId,
        url: input.url,
      })
      .where(eq(discordLiveUsers.userId, input.userId))

    console.log("[discord-live-users] updated", input)
  }
)

export const remove = zod(SelectSchema.shape.userId, async (userId) =>
  db
    .delete(discordLiveUsers)
    .where(eq(discordLiveUsers.userId, userId))
    .then(() => userId)
)
