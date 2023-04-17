import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"

import { getGuild, getReactionFromPartial, getUserFromPartial } from "~/lib/helpers"
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

  // Ensure fresh member data
  const member = guild.members.resolve(partialUser.id)

  if (!member) throw Error("Could not resolve member")

  // Remove other reactions and roles from this member
  await Promise.all(
    reaction.message.reactions.cache.map(async (messageReaction) => {
      if (messageReaction.emoji.name === option) return
      return messageReaction.users.remove(partialUser.id)
    })
  )

  // Remove other reactions and roles from this member
  // Promise.all(
  //   reaction.message.reactions.cache.map(async (messageReaction) => {
  //     const users = await messageReaction.users.fetch()
  //     if (messageReaction.emoji.name !== option) {
  //       console.log("removing other reaction:", reaction.emoji.name)
  //       messageReaction.users.cache.delete(user.id)
  //       await member.roles.remove(OPTIONS[option])
  //     }
  //   })
  // )

  // // Member already has selected role. Bail out
  // if (member.roles.cache.has(OPTIONS[option])) return

  // // Add the new role
  // await member.roles.add(OPTIONS[option])
}
