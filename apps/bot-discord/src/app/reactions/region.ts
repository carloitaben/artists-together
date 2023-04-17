import { registerEventHandler } from "~/lib/core"
import { getGuild, getReactionFromPartial } from "~/lib/helpers"
import { APPLICATION_ID, ROLES } from "~/lib/constants"

const MESSAGE_ID = ""

const OPTIONS = {
  "🖤": ROLES.REGION_USA,
  "❤️": ROLES.REGION_CANADA,
  "🧡": ROLES.REGION_MEXICO,
  "💛": ROLES.REGION_SOUTH_AMERICA,
  "💚": ROLES.REGION_AFRICA,
  "💙": ROLES.REGION_ASIA,
  "💜": ROLES.REGION_AUSTRALIA,
  "🤍": ROLES.REGION_EUROPE,
  "🇳🇿": ROLES.REGION_NEW_ZEALAND,
  "🇬🇧": ROLES.REGION_UNITED_KINGDOM,
}

function isValidOption(name: string | null): name is keyof typeof OPTIONS {
  return String(name) in OPTIONS
}

registerEventHandler("messageReactionAdd", async (partialReaction, partialUser) => {
  if (partialUser.id === APPLICATION_ID) return
  if (partialReaction.message.id !== MESSAGE_ID) return

  // Save this as a constant to get better narrowing with the type predicate
  const option = partialReaction.emoji.name

  // Remove invalid reactions
  if (!isValidOption(option)) {
    await partialReaction.remove()
    return
  }

  const [guild, reaction] = await Promise.all([getGuild(partialUser.client), getReactionFromPartial(partialReaction)])
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
})

registerEventHandler("messageReactionRemove", async (partialReaction, partialUser) => {
  if (partialUser.id === APPLICATION_ID) return
  if (partialReaction.message.id !== MESSAGE_ID) return

  // Save this as a constant to get better narrowing with the type predicate
  const option = partialReaction.emoji.name

  // Remove invalid reactions
  if (!isValidOption(option)) return

  const guild = await getGuild(partialUser.client)
  const member = guild.members.resolve(partialUser.id)

  if (!member) throw Error(`Could not resolve member for user ${partialUser}`)

  // Remove role from this member
  await member.roles.remove(OPTIONS[option])
})
