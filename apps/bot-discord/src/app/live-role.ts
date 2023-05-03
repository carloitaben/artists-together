import { ActivityType } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

registerEventHandler("ready", async (client) => {
  const guild = await getGuild(client)

  guild.members.cache.forEach((member) => {
    const hasLiveNowRole = member.roles.cache.has(ROLES.LIVE_NOW)

    const isStreaming =
      member.presence?.activities.some((activity) => {
        return activity.type === ActivityType.Streaming
      }) ?? false

    if (isStreaming && !hasLiveNowRole) {
      return member.roles.add(ROLES.LIVE_NOW)
    }

    if (!isStreaming && hasLiveNowRole) {
      return member.roles.remove(ROLES.LIVE_NOW)
    }
  })
})

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

  if (!isStreaming) return newPresence.member.roles.remove(role)

  return newPresence.member.roles.add(role)
})
