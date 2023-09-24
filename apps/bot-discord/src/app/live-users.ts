import { ActivityType, Presence } from "discord.js"
import { DiscordLiveUsers } from "db"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

function getStreamActivity(presence: Presence | null) {
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
    const streamingActivity = getStreamActivity(member.presence)

    if (!hasArtistRole && hasLiveRole) {
      console.log(
        "[live-users] ready: removing db entry and role (non-artist)",
        member.user.username,
      )

      return Promise.all([
        member.roles.remove(ROLES.LIVE_NOW),
        DiscordLiveUsers.remove(member.user.id),
      ])
    }

    if (!streamingActivity && hasLiveRole) {
      console.log(
        "[live-users] ready: removing db entry and role",
        member.user.username,
      )

      return Promise.all([
        member.roles.remove(ROLES.LIVE_NOW),
        DiscordLiveUsers.remove(member.user.id),
      ])
    }

    if (streamingActivity?.url && hasArtistRole && !hasLiveRole) {
      console.log(
        "[live-users] ready: adding db entry and role",
        member.user.username,
      )

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

registerEventHandler("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence.guild) return
  if (!newPresence.member) return
  if (!newPresence.user) return
  if (newPresence.user.bot) return

  const hasArtistRole = newPresence.member.roles.cache.has(ROLES.ARTIST)
  const hasLiveNowRole = newPresence.member.roles.cache.has(ROLES.LIVE_NOW)

  if (!hasArtistRole) return

  const oldStream = getStreamActivity(oldPresence)
  const newStream = getStreamActivity(newPresence)

  if (oldStream?.url && newStream?.url && oldStream.url === newStream.url) {
    console.log(
      "[live-users] presenceUpdate: ignoring update (url is the same)",
      newPresence.user.username,
      newStream.url,
    )

    return
  }

  if (oldStream?.url && newStream?.url) {
    console.log(
      "[live-users] presenceUpdate: updating db entry (url changed)",
      newPresence.user.username,
      newStream.url,
    )

    return DiscordLiveUsers.update({
      url: newStream.url,
      userId: newPresence.member.user.id,
    })
  }

  if (newStream?.url) {
    console.log(
      "[live-users] presenceUpdate: adding db entry and role",
      newPresence.user.username,
      newStream.url,
    )

    return Promise.all([
      newPresence.member.roles.add(ROLES.LIVE_NOW),
      DiscordLiveUsers.create({
        url: newStream.url,
        userId: newPresence.member.user.id,
      }),
    ])
  }

  if (hasLiveNowRole) {
    console.log(
      "[live-users] presenceUpdate: removing db entry and role",
      newPresence.user.username,
    )

    return Promise.all([
      newPresence.member.roles.remove(ROLES.LIVE_NOW),
      DiscordLiveUsers.remove(newPresence.member.user.id),
    ])
  }
})
