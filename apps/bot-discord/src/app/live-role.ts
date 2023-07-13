import { ActivityType, GuildMember } from "discord.js"
import { connect, discordLiveUsers, eq } from "db"

import { registerEventHandler } from "~/lib/core"
import { getGuild, getRole } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

const db = connect()

async function insert(member: GuildMember, url: string | null) {
  if (url) {
    return db.insert(discordLiveUsers).values({
      userId: member.user.id,
      url,
    })
  }
}

async function remove(member: GuildMember) {
  return db.delete(discordLiveUsers).where(eq(discordLiveUsers.userId, member.user.id))
}

registerEventHandler("ready", async (client) => {
  const guild = await getGuild(client)

  guild.members.cache.forEach((member) => {
    if (member.user.bot) return

    const hasArtistRole = member.roles.cache.has(ROLES.ARTIST)
    const hasLiveRole = member.roles.cache.has(ROLES.LIVE_NOW)
    const streamingActivity = member.presence?.activities.find((activity) => activity.type === ActivityType.Streaming)

    if (!hasArtistRole && hasLiveRole) {
      return Promise.all([remove(member), member.roles.remove(ROLES.LIVE_NOW)])
    }

    if (!streamingActivity && hasLiveRole) {
      return Promise.all([remove(member), member.roles.remove(ROLES.LIVE_NOW)])
    }

    if (streamingActivity && hasArtistRole && !hasLiveRole) {
      return Promise.all([insert(member, streamingActivity.url), member.roles.add(ROLES.LIVE_NOW)])
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
  const hasArtistRole = newPresence.member.roles.cache.has(ROLES.ARTIST)
  const streamingActivity = newPresence.activities.find((activity) => activity.type === ActivityType.Streaming)

  if (!streamingActivity || !hasArtistRole) {
    return await Promise.all([remove(newPresence.member), newPresence.member.roles.remove(role)])
  }

  return await Promise.all([insert(newPresence.member, streamingActivity.url), newPresence.member.roles.add(role)])
})
