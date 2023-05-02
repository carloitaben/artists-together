import { connect, discordPolls, eq } from "db"

import { registerEventHandler } from "~/lib/core"

registerEventHandler("ready", async () => {
  const db = connect()

  // const polls = await db.select().from(discordPolls).where(eq(discordPolls.deadline, ""))
  const polls = await db.select().from(discordPolls)

  console.log(polls)
  console.log("here we would track deadlines")
})
