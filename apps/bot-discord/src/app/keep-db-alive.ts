import { connect, keepAliveDummies } from "db"
import { registerEventHandler } from "~/lib/core"
import { cron } from "~/lib/helpers"

/**
 * PlanetScale deactivates databases without activity.
 * We write daily to this table to prevent deactivation
 */
registerEventHandler("ready", () => {
  cron("0 0 * * *", async () => {
    const db = connect()
    await db.insert(keepAliveDummies).values({})
    await db.delete(keepAliveDummies)
  })
})
