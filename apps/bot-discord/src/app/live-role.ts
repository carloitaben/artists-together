import { ActivityType } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

registerEventHandler("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence.guild) return
  if (!newPresence.member) return
  if (!newPresence.user) return
  if (newPresence.user.bot) return

  const role = await getRole(newPresence.guild.roles, ROLES.LIVE_NOW)

  const isStreaming = newPresence.activities.some((activity) => {
    return activity.type === ActivityType.Streaming
  })

  if (!isStreaming) return newPresence.member.roles.remove(role)

  return newPresence.member.roles.add(role)
})
