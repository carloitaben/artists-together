import { database, eq, liveUserTable } from "@artists-together/core/database"
import { ROLE } from "@artists-together/core/discord"
import { Activity, ActivityType, Presence } from "discord.js"
import { registerEventHandler } from "~/lib/core"
import { getGuild } from "~/lib/utils"

function isValidActivity(activity: Activity) {
  if (activity.type !== ActivityType.Streaming) return false

  switch (activity.state) {
    case "Software and Game Development":
    case "Art":
    case "Food & Drink":
    case "Makers & Crafting":
    case "DJs":
    case "Music":
    case "Miniatures & Models":
    case "Writting & Reading":
      return true
    default:
      return false
  }
}

function getValidStreamActivity(presence: Presence | null) {
  return presence?.activities.find((activity) => isValidActivity(activity))
}

registerEventHandler("ready", async (client) => {
  const guild = await getGuild(client)

  guild.members.cache.forEach((member) => {
    if (member.user.bot) return

    const hasArtistRole = member.roles.cache.has(ROLE.ARTIST)
    const hasLiveRole = member.roles.cache.has(ROLE.LIVE_NOW)
    const streamingActivity = getValidStreamActivity(member.presence)

    if (!hasArtistRole && hasLiveRole) {
      console.log(
        "[live-users] ready: removing db entry and role (non-artist)",
        member.user.username
      )

      return Promise.all([
        member.roles.remove(ROLE.LIVE_NOW),
        database
          .delete(liveUserTable)
          .where(eq(liveUserTable.discordId, member.user.id)),
      ])
    }

    if (!streamingActivity && hasLiveRole) {
      console.log(
        "[live-users] ready: removing db entry and role",
        member.user.username
      )

      return Promise.all([
        member.roles.remove(ROLE.LIVE_NOW),
        database
          .delete(liveUserTable)
          .where(eq(liveUserTable.discordId, member.user.id)),
      ])
    }

    if (streamingActivity?.url && hasArtistRole && !hasLiveRole) {
      console.log(
        "[live-users] ready: adding db entry and role",
        member.user.username
      )

      return Promise.all([
        member.roles.add(ROLE.LIVE_NOW),
        database
          .insert(liveUserTable)
          .values({
            url: streamingActivity.url,
            discordId: member.user.id,
          })
          .onConflictDoUpdate({
            target: liveUserTable.discordId,
            set: { url: streamingActivity.url },
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

  const hasArtistRole = newPresence.member.roles.cache.has(ROLE.ARTIST)
  const hasLiveNowRole = newPresence.member.roles.cache.has(ROLE.LIVE_NOW)

  if (!hasArtistRole) return

  const oldStream = getValidStreamActivity(oldPresence)
  const newStream = getValidStreamActivity(newPresence)

  if (
    oldStream?.url &&
    newStream?.url &&
    oldStream.url === newStream.url &&
    hasLiveNowRole
  ) {
    console.log(
      "[live-users] presenceUpdate: ignoring update (url is the same and user already has live role)",
      newPresence.user.username,
      newStream.url
    )

    return
  }

  if (oldStream?.url && newStream?.url) {
    console.log(
      "[live-users] presenceUpdate: updating db entry (url changed)",
      newPresence.user.username,
      newStream.url
    )

    return database
      .update(liveUserTable)
      .set({ url: newStream.url })
      .where(eq(liveUserTable.discordId, newPresence.member.user.id))
  }

  if (hasLiveNowRole) {
    console.log(
      "[live-users] presenceUpdate: removing db entry and role",
      newPresence.user.username
    )

    return Promise.all([
      newPresence.member.roles.remove(ROLE.LIVE_NOW),
      database
        .delete(liveUserTable)
        .where(eq(liveUserTable.discordId, newPresence.member.user.id)),
    ])
  }
})
