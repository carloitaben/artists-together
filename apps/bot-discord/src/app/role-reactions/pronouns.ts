import { env } from "~/lib/env"
import { registerEventHandler } from "~/lib/core"
import { getMember, getReactionFromPartial } from "~/lib/helpers"
import { ROLES } from "~/lib/constants"

const MESSAGE_ID = env.NODE_ENV === "development" ? "" : "1101898363600916602"

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

  const option = partialReaction.emoji.name

  if (!isValidOption(option)) return partialReaction.remove()

  const member = await getMember(partialReaction.message.guild.members, partialUser.id)
  return member.roles.add(OPTIONS[option])
})

registerEventHandler("messageReactionRemove", async (partialReaction, partialUser) => {
  if (!partialReaction.message.inGuild()) return
  if (partialReaction.message.id !== MESSAGE_ID) return
  if (partialUser.bot) return

  const option = partialReaction.emoji.name

  if (!isValidOption(option)) return

  const member = await getMember(partialReaction.message.guild.members, partialUser.id)
  return member.roles.remove(OPTIONS[option])
})
