import { KeepAlive } from "db"
import { registerEventHandler } from "~/lib/core"
import { cron } from "~/lib/helpers"

registerEventHandler("ready", () => {
  cron("0 0 * * *", async () => {
    console.log("[keep-alive] Poking db")
    await KeepAlive.poke()
    console.log("[keep-alive] Poked successfully")
  })
})
