import { eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { db } from "../db"
import { zod } from "../utils"
import { discordLiveUsers } from "./sql"

export const schema = createSelectSchema(discordLiveUsers, {
  url: (schema) => schema.url.url(),
})

export type Schema = z.infer<typeof schema>

export const list = zod(z.void(), async () =>
  db
    .select()
    .from(discordLiveUsers)
    .then((value) => value),
)

export const create = zod(
  schema.pick({ userId: true, url: true }),
  async (input) => {
    await db.insert(discordLiveUsers).values({
      userId: input.userId,
      url: input.url,
    })
  },
)

export const remove = zod(schema.shape.userId, async (userId) =>
  db
    .delete(discordLiveUsers)
    .where(eq(discordLiveUsers.userId, userId))
    .then(() => userId),
)
