import { InferModel, connect, discordPolls, eq } from "db"
import { registerEventHandler } from "~/lib/core"

type DiscordPolls = InferModel<typeof discordPolls>

export const polls = new Set<DiscordPolls>()

export async function addPoll(poll: InferModel<typeof discordPolls, "insert">) {
  const db = connect()
  await db.insert(discordPolls).values(poll)
  const [dbPoll] = await db.select().from(discordPolls).where(eq(discordPolls.name, poll.name)).limit(1)
  polls.add(dbPoll)
}

registerEventHandler("ready", async () => {
  const db = connect()
  const dbPolls = await db.select().from(discordPolls).where(eq(discordPolls.closed, false))
  dbPolls.forEach((poll) => polls.add(poll))
})
