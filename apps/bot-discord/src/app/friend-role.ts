import { env } from "~/lib/env"
import { registerEventHandler } from "~/lib/core"
import { getMember } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

const MESSAGE_ID = env.NODE_ENV === "development" ? "" : "1150447914641010729"

const REACTION = "🔓"

registerEventHandler("messageReactionAdd", async (partialReaction, partialUser) => {
  if (!partialReaction.message.inGuild()) return
  if (partialReaction.message.id !== MESSAGE_ID) return
  if (partialUser.bot) return

  if (partialReaction.emoji.name !== REACTION) {
    return partialReaction.remove()
  }

  const member = await getMember(partialReaction.message.guild.members, partialUser.id)

  if (member.roles.cache.has(ROLES.ARTIST)) return

  return member.roles.add(ROLES.FRIEND)
})
