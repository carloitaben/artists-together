import { registerEventHandler } from "~/lib/core"
import { cron, oneOf, getPublicFile } from "~/lib/helpers"

const avatars = ["0", "2", "3", "4", "5"]

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", async () => {
    const avatar = oneOf(avatars)
    const avatarFile = getPublicFile(`/images/avatars/${avatar}.png`)
    client.user.setAvatar(avatarFile)
  })
})
