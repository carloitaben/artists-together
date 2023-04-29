import { registerEventHandler } from "~/lib/core"
import { getRandomArrayItem, cron, staticUrl } from "~/lib/helpers"

const avatars = ["icon-02", "icon-15", "icon-16", "icon-17", "icon-18", "icon-19"]

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", () => {
    const avatar = getRandomArrayItem(avatars)
    const avatarUrl = staticUrl(`/avatars/${avatar}.png`)
    client.user.setAvatar(avatarUrl)
  })
})
