import { ActivityType, Presence } from "discord.js"
import { DiscordLiveUsers } from "db"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

function getStreamingActivity(presence: Presence | null) {
  return presence?.activities.find(
    (activity) => activity.type === ActivityType.Streaming,
  )
}

registerEventHandler("ready", async (client) => {
  const guild = await getGuild(client)

  guild.members.cache.forEach((member) => {
    if (member.user.bot) return

    const hasArtistRole = member.roles.cache.has(ROLES.ARTIST)
    const hasLiveRole = member.roles.cache.has(ROLES.LIVE_NOW)
    const streamingActivity = getStreamingActivity(member.presence)

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
  const streamingActivity = getStreamingActivity(presence)

  const oldPresence = getStreamingActivity(_)

  console.log(
    "[live-users] presenceUpdate for user",
    presence.member.user.username,
    {
      oldPresence: {
        applicationId: oldPresence?.applicationId,
        name: oldPresence?.name,
        url: oldPresence?.url,
        details: oldPresence?.details,
        state: oldPresence?.state,
      },
      newPresence: {
        url: streamingActivity?.url,
        name: streamingActivity?.name,
        applicationId: streamingActivity?.applicationId,
        details: streamingActivity?.details,
        state: streamingActivity?.state,
      },
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
