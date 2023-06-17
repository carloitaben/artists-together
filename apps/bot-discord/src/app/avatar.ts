import { registerEventHandler } from "~/lib/core"
import { cron, getRandomArrayItem, getPublicFile } from "~/lib/helpers"

const avatars = ["0", "1", "2", "3", "4", "5"]

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", async () => {
    const avatar = getRandomArrayItem(avatars)
    const avatarFile = getPublicFile(`/images/avatars/${avatar}.png`)
    client.user.setAvatar(avatarFile)
  })
})
