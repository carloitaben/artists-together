import { eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { zod } from "../zod"
import { db } from "../db"
import { discordLiveUsers } from "./sql"

export const schema = createSelectSchema(discordLiveUsers, {
  url: (schema) => schema.url.url(),
})

export type Schema = z.infer<typeof schema>

export const list = zod(z.void(), async () =>
  db
    .select()
    .from(discordLiveUsers)
    .then((value) => value)
)

export const create = zod(schema.pick({ userId: true, url: true }), async (input) => {
  console.log("[discord-live-users] adding", input)

  await db.insert(discordLiveUsers).values({
    userId: input.userId,
    url: input.url,
  })

  console.log("[discord-live-users] added", input)
})

export const update = zod(
  schema.pick({ userId: true, url: true }),
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
export const remove = zod(schema.shape.userId, async (userId) =>
  db
    .delete(discordLiveUsers)
    .where(eq(discordLiveUsers.userId, userId))
    .then(() => userId)
)
