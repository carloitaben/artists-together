import {
  Client,
  Events,
  Partials,
  GatewayIntentBits,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageReaction,
  PartialMessageReaction,
  User,
  PartialUser,
} from "discord.js"

import { APPLICATION_ID, CHANNELS } from "~/lib/constants"
import { env } from "~/lib/env"
import { getChannel, getChannelMessages, getGuild, getReactionFromPartial, getUserFromPartial } from "~/lib/helpers"
import pronounsReactions from "~/app/reactions/pronouns"

export const say = new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make PAL say something in the current channel")
  .addStringOption((option) => option.setName("message").setDescription("Message to send").setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

await bot.login(env.DISCORD_BOT_TOKEN)

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.commandName) {
    case say.name:
      const message = interaction.options.getString("message")

      if (!message) {
        await interaction.reply({
          ephemeral: true,
          content: "You have to write a message!",
        })

        return
      }

      if (!interaction.channel) {
        throw Error("Expected channel property in interaction")
      }

      await Promise.all([
        interaction.channel.send(message),
        interaction.reply({
          content: "Done!",
          ephemeral: true,
        }),
      ])

      break
    default:
      interaction.reply({
        ephemeral: true,
        content: "Oops! I cannot handle that command.",
      })
  }
})

// Pronouns reaction message creation
// bot.on(Events.ClientReady, async (client) => {
//   const guild = await getGuild(client)
//   const channel = await getChannel(guild, CHANNELS.SERVER_MAP_AND_ROLES)

//   if (!channel.isTextBased()) {
//     throw Error("Expected CHANNELS.SERVER_MAP_AND_ROLES channel to be text based")
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

bot.on(Events.ClientReady, () => {
  console.log("ready")
})

bot.on(Events.MessageReactionAdd, async (...args) => {
  pronounsReactions(...args, bot)
})

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
// }

// bot.on(Events.MessageReactionAdd, async (partialReaction, partialUser) => {
//   // Ignore bot own reactions
//   if (partialUser.id === APPLICATION_ID) return

//   switch (partialReaction.message.id) {
//     case "1097479968872747079":
//       // await handlePronouns(partialReaction, partialUser)
//       // pronouns
//       const [reaction, user] = await Promise.all([
//         getReactionFromPartial(partialReaction),
//         getUserFromPartial(partialUser),
//       ])

//       switch (reaction.emoji.name) {
//         case "🇹":
//           user.break
//         case "🇸":
//           break
//         case "🇭":
//           break
//         default:
//           await reaction.remove()
//       }
//       break
//     case "1097467066891645068":
//       // location
//       break
//     default:
//       return
//   }

//   const [reaction, user] = await Promise.all([getReactionFromPartial(partialReaction), getUserFromPartial(partialUser)])

//   const guild = await getGuild(bot)

//   console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`)
//   console.log("emoji is", reaction.emoji)
//   console.log("guild is", guild)
//   console.log("user is", user)
//   console.log("reaction is", reaction)

//   guild.roles.fetch()

//   // const role = await reaction.client.guild.roles.fetch("role id")

//   // message.guild.members.fetch(user.id).then((member) => {
//   //   member.roles.add(role)
//   // })

//   // message.member.roles.cache.find
//   // user.id
//   // The reaction is now also fully available and the properties will be reflected accurately:
// })
