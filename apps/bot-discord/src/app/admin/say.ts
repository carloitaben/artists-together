import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"

export const builder = new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make PAL say something in the current channel")
  .addStringOption((option) => option.setName("message").setDescription("Message to send").setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)

registerSlashCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

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
})
