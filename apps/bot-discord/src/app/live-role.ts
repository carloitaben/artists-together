import { ActivityType } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { ROLES } from "~/lib/constants"

registerEventHandler("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence.guild) return
  if (!newPresence.member) return
  if (!newPresence.user) return
  if (newPresence.user.bot) return

  const role =
    newPresence.guild.roles.cache.get(ROLES.LIVE_NOW) ?? (await newPresence.guild.roles.fetch(ROLES.LIVE_NOW))

  if (!role) throw Error("Could not find LIVE_NOW role")

  const isStreaming = newPresence.activities.some((activity) => {
    return activity.type === ActivityType.Streaming
  })

  if (!isStreaming) return newPresence.member.roles.remove(role)

  return newPresence.member.roles.add(role)
})
