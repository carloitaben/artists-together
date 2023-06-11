import { registerEventHandler } from "~/lib/core"
import { getRandomArrayItem, cron, staticUrl } from "~/lib/helpers"

const avatars = ["0", "1", "2", "3", "4", "5"]

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", () => {
    const avatar = getRandomArrayItem(avatars)
    const avatarUrl = staticUrl(`/images/avatars/${avatar}.png`)
    client.user.setAvatar(avatarUrl)
  })
})
