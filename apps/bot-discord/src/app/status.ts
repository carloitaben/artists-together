import { ActivityType, ClientPresence } from "discord.js"
import { registerEventHandler } from "~/lib/core"
import { cron, oneOf } from "~/lib/helpers"

const statuses = ["Doodling", "Organising AT files", "Lurking"]

function setRandomStatus(presence: ClientPresence) {
  return presence.set({
    activities: [
      {
        type: ActivityType.Custom,
        name: oneOf(statuses),
      },
    ],
  })
}

registerEventHandler("ready", (client) => {
  setRandomStatus(client.user.presence)
  cron("0 */6 * * *", () => {
    setRandomStatus(client.user.presence)
  })
})
