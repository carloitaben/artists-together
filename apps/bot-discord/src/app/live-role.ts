import { ActivityType } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { ROLES } from "~/lib/constants"

registerEventHandler("presenceUpdate", async (oldPresence, newPresence) => {
  console.log("[DEBUG presenceUpdate]", {
    oldPresence,
    newPresence,
  })

  if (!newPresence.guild) return
  if (!newPresence.member) return
  if (!newPresence.user) return
  if (newPresence.user.bot) return

  console.log("[DEBUG presenceUpdate] passed guards")

  const role =
    newPresence.guild.roles.cache.get(ROLES.LIVE_NOW) ?? (await newPresence.guild.roles.fetch(ROLES.LIVE_NOW))
  if (!role) throw Error("Could not find LIVE_NOW role")

  console.log("[DEBUG presenceUpdate] found live role", role)

  const isStreaming = newPresence.activities.some((activity) => {
    console.log("[DEBUG presenceUpdate] newPresence.activities.some", activity)
    return activity.type === ActivityType.Streaming && activity.name === "Twitch"
  })

  console.log("[DEBUG presenceUpdate] isStreaming", isStreaming)

  if (isStreaming) {
    console.log("[DEBUG presenceUpdate] adding role to member", newPresence.member.nickname)
    await newPresence.member.roles.add(role)
  } else {
    console.log("[DEBUG presenceUpdate] removing role from member", newPresence.member.nickname)
    await newPresence.member.roles.remove(role)
  }
})
