import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"
import { CHANNELS } from "~/lib/constants"

export const builder = new SlashCommandBuilder()
  .setName("bootstrapreactionsmessages")
  .setDescription("Creates the neccesary messages for the reactions system to work")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)

registerSlashCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.user.username !== "Carloitaben") {
    return interaction.reply({
      content: "You cannot use this command",
      ephemeral: true,
    })
  }

  const channel = interaction.client.channels.cache.get(CHANNELS.ROLES)
  if (!channel) throw Error("Expected roles channel to exist")
  if (!channel.isTextBased()) throw Error("Expected roles channel to be text based")

  await interaction.deferReply({ ephemeral: true })

  const pronounsMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        description:
          "React to this message to add your preferred pronouns to your roles!" +
          "\n" +
          "🇹" +
          "\n" +
          "They/Them" +
          "\n" +
          "🇸" +
          "\n" +
          "She/Her" +
          "\n" +
          "🇭" +
          "\n" +
          "He/Him",
      }),
    ],
  })

  try {
    await pronounsMessage.react("🇹")
    await pronounsMessage.react("🇸")
    await pronounsMessage.react("🇭")
  } catch (error) {
    console.error("One of the emojis failed to react:", error)
  }

  const regionMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        description:
          "React to this Message to add a location role! We'd like to know this for logistical reasons involving shipping and distribution." +
          "\n" +
          "(We're based in the US, so the locations may be inconsiderately broad the further away you get to us D: very open to suggestion to restructure this!)" +
          "\n" +
          "🖤 - USA" +
          "\n" +
          "❤️ - Canada" +
          "\n" +
          "🧡 - Mexico" +
          "\n" +
          "💛 - South America" +
          "\n" +
          "💚 - Africa" +
          "\n" +
          "💙 - Asia" +
          "\n" +
          "💜 - Australia" +
          "\n" +
          "🤍 - Europe" +
          "\n" +
          "🇳🇿 - New Zealand" +
          "\n" +
          "🇬🇧 - United Kingdom",
        footer: {
          text: "(Please contact @admin if you are having issues with this role assignment message or if you would like your region specified!)",
        },
      }),
    ],
  })

  try {
    await regionMessage.react("🖤")
    await regionMessage.react("❤️")
    await regionMessage.react("🧡")
    await regionMessage.react("💛")
    await regionMessage.react("💚")
    await regionMessage.react("💙")
    await regionMessage.react("💜")
    await regionMessage.react("🤍")
    await regionMessage.react("🇳🇿")
    await regionMessage.react("🇬🇧")
  } catch (error) {
    console.error("One of the emojis failed to react:", error)
  }

  return interaction.editReply({
    content: "done",
  })
})
