import { ActivityType } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

registerEventHandler("presenceUpdate", async (_, newPresence) => {
  if (!newPresence.guild) return
  if (!newPresence.member) return
  if (!newPresence.user) return
  if (newPresence.user.bot) return

  const guild = await getGuild(newPresence.client)
  const role = await getRole(guild.roles, ROLES.LIVE_NOW)

  const isStreaming = newPresence.activities.some((activity) => {
    return activity.type === ActivityType.Streaming
  })

  if (isStreaming) return newPresence.member.roles.add(role)

  if (newPresence.member.roles.cache.has(ROLES.LIVE_NOW)) {
    return newPresence.member.roles.remove(role)
  }
})
