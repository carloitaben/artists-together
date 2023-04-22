import { registerEventHandler } from "~/lib/core"
import { getMember, getReactionFromPartial } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

const MESSAGE_ID = "1099286743422877696"

const OPTIONS = {
  "🇹": ROLES.PRONOUNS_THEY_THEM,
  "🇸": ROLES.PRONOUNS_SHE_HER,
  "🇭": ROLES.PRONOUNS_HE_HIM,
}

function isValidOption(name: string | null): name is keyof typeof OPTIONS {
  return String(name) in OPTIONS
}

registerEventHandler("messageReactionAdd", async (partialReaction, partialUser) => {
  if (!partialReaction.message.inGuild()) return
  if (partialReaction.message.id !== MESSAGE_ID) return
  if (partialUser.bot) return

  // Save this as a constant to get better narrowing with the type predicate
  const option = partialReaction.emoji.name

  // Remove invalid reactions
  if (!isValidOption(option)) {
    try {
      await partialReaction.remove()
    } catch (error) {
      console.error(error)
    } finally {
      return
    }
  }

  // Resolve partials
  const [reaction, member] = await Promise.all([
    getReactionFromPartial(partialReaction),
    getMember(partialReaction.message.guild.members, partialUser.id),
  ])

  // Switch role for this member
  Object.entries(OPTIONS).map(([k, v]) => {
    if (k === option) return member.roles.add(v).catch(console.error)
    if (member.roles.cache.has(v)) return member.roles.remove(v).catch(console.error)
  })

  // Remove other reactions from this member
  reaction.message.reactions.cache.forEach((reaction) => {
    if (reaction.emoji.name !== option) return reaction.users.remove(partialUser.id).catch(console.error)
  })
})

registerEventHandler("messageReactionRemove", async (partialReaction, partialUser) => {
  if (!partialReaction.message.inGuild()) return
  if (partialReaction.message.id !== MESSAGE_ID) return
  if (partialUser.bot) return

  // Save this as a constant to get better narrowing with the type predicate
  const option = partialReaction.emoji.name

  // Ignore invalid reactions
  if (!isValidOption(option)) return

  try {
    const member = await getMember(partialReaction.message.guild.members, partialUser.id)
    await member.roles.remove(OPTIONS[option])
  } catch (error) {
    console.error(error)
  }
})
