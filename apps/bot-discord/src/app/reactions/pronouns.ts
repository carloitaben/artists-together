import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"

import { getGuild, getReactionFromPartial } from "~/lib/helpers"
import { APPLICATION_ID, ROLES } from "~/lib/constants"

const MESSAGE_ID = "1097479968872747079"

const OPTIONS = {
  "🇹": ROLES.PRONOUNS_THEY_THEM,
  "🇸": ROLES.PRONOUNS_SHE_HER,
  "🇭": ROLES.PRONOUNS_HE_HIM,
}

function isValidOption(name: string | null): name is keyof typeof OPTIONS {
  return String(name) in OPTIONS
}

export default async function (
  partialReaction: MessageReaction | PartialMessageReaction,
  partialUser: User | PartialUser,
  client: Client
) {
  if (partialUser.id === APPLICATION_ID) return
  if (partialReaction.message.id !== MESSAGE_ID) return

  // Save this as a constant to get better narrowing with the type predicate
  const option = partialReaction.emoji.name

  // Remove invalid reactions
  if (!isValidOption(option)) return partialReaction.remove()

  const [guild, reaction] = await Promise.all([getGuild(client), getReactionFromPartial(partialReaction)])

  // Ensure member data is fresh
  const member = guild.members.resolve(partialUser.id)

  if (!member) throw Error(`Could not resolve member for user ${partialUser}`)

  // Remove other reactions from this member
  const reactionsPromises = reaction.message.reactions.cache.map(async (messageReaction) => {
    if (messageReaction.emoji.name !== option) return messageReaction.users.remove(partialUser.id)
  })

  // Remove other roles from this member
  const rolesPromises = Object.entries(OPTIONS).map(([k, v]) => {
    if (k === option) return member.roles.add(v)
    if (member.roles.cache.has(v)) return member.roles.remove(v)
  })

  await Promise.all([...reactionsPromises, ...rolesPromises])
}
