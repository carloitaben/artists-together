import { ActivityType } from "discord.js"
import { DiscordLiveUsers } from "db"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

registerEventHandler("ready", async (client) => {
  const guild = await getGuild(client)

  guild.members.cache.forEach((member) => {
    if (member.user.bot) return

    const hasArtistRole = member.roles.cache.has(ROLES.ARTIST)
    const hasLiveRole = member.roles.cache.has(ROLES.LIVE_NOW)
    const streamingActivity = member.presence?.activities.find(
      (activity) => activity.type === ActivityType.Streaming,
    )

    if (!hasArtistRole && hasLiveRole) {
      return Promise.all([
        member.roles.remove(ROLES.LIVE_NOW),
        DiscordLiveUsers.remove(member.user.id),
      ])
    }

    if (!streamingActivity && hasLiveRole) {
      return Promise.all([
        member.roles.remove(ROLES.LIVE_NOW),
        DiscordLiveUsers.remove(member.user.id),
      ])
    }

    if (streamingActivity?.url && hasArtistRole && !hasLiveRole) {
      return Promise.all([
        member.roles.add(ROLES.LIVE_NOW),
        DiscordLiveUsers.create({
          url: streamingActivity.url,
          userId: member.user.id,
        }),
      ])
    }
  })
})

registerEventHandler("presenceUpdate", async (_, presence) => {
  if (!presence.guild) return
  if (!presence.member) return
  if (!presence.user) return
  if (presence.user.bot) return

  const guild = await getGuild(presence.client)
  const role = await getRole(guild.roles, ROLES.LIVE_NOW)
  const hasArtistRole = presence.member.roles.cache.has(ROLES.ARTIST)
  const streamingActivity = presence.activities.find(
    (activity) => activity.type === ActivityType.Streaming,
  )

  console.log(
    "[live-users] presenceUpdate for user",
    presence.member.user.username,
    {
      oldPresence: _,
      newPresence: presence,
    },
  )

  if (!streamingActivity || !hasArtistRole) {
    return Promise.all([
      presence.member.roles.remove(ROLES.LIVE_NOW),
      DiscordLiveUsers.remove(presence.member.user.id),
    ])
  }

  if (streamingActivity.url) {
    return Promise.all([
      presence.member.roles.add(role),
      DiscordLiveUsers.create({
        url: streamingActivity.url,
        userId: presence.member.user.id,
      }),
    ])
  }
})
