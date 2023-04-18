import { registerEventHandler } from "~/lib/core"
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

registerEventHandler("ready", async (client) => {
  //   const guild = await getGuild(client)
  //   const channel = await getChannel(guild, CHANNELS.ROLES)
  //   if (!channel.isTextBased()) {
  //     throw Error("Expected CHANNELS.ROLES channel to be text based")
  //   }
  //   const message = await channel.send({
  //     embeds: [
  //       new EmbedBuilder({
  //         description:
  //           "React to this message to add your preferred pronouns to your roles!" +
  //           "\n" +
  //           "🇹" +
  //           "\n" +
  //           "They/Them" +
  //           "\n" +
  //           "🇸" +
  //           "\n" +
  //           "She/Her" +
  //           "\n" +
  //           "🇭" +
  //           "\n" +
  //           "He/Him",
  //       }),
  //     ],
  //   })
  //   try {
  //     // Do not parallelize as we want to maintain this order
  //     await message.react("🇹")
  //     await message.react("🇸")
  //     await message.react("🇭")
  //   } catch (error) {
  //     console.error("One of the emojis failed to react:", error)
  //   }
  // })
  // async function handlePronouns(
  //   partialReaction: MessageReaction | PartialMessageReaction,
  //   partialUser: User | PartialUser
  // ) {
  //   // Ignore bot own reactions
  //   if (partialUser.id === APPLICATION_ID) return
  //   const [guild, reaction, user] = await Promise.all([
  //     getGuild(bot),
  //     getReactionFromPartial(partialReaction),
  //     getUserFromPartial(partialUser),
  //   ])
  //   const member =
  //     guild.members.cache.find((member) => member.id === partialUser.id) ?? (await guild.members.fetch({ user }))
  //   const roles = member
  //   switch (reaction.emoji.name) {
  //     case "🇹":
  //       member.roles.remove()
  //       user.break
  //     case "🇸":
  //       break
  //     case "🇭":
  //       break
  //     default:
  //       await reaction.remove()
  //   }
})
