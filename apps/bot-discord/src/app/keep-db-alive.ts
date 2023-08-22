import { KeepAlive } from "db"
import { registerEventHandler } from "~/lib/core"
import { cron } from "~/lib/helpers"

registerEventHandler("ready", () => {
  cron("0 0 * * *", KeepAlive.poke)
})
