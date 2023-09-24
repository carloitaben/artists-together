import { ActivityType } from "discord.js"
import { registerEventHandler } from "~/lib/core"
import { cron, oneOf } from "~/lib/helpers"

const statuses = ["Doodling", "Organising AT files", "Lurking"]

registerEventHandler("ready", (client) => {
  cron("0 */6 * * *", () => {
    client.user.presence.set({
      activities: [
        {
          type: ActivityType.Custom,
          name: oneOf(statuses),
        },
      ],
    })
  })
})
