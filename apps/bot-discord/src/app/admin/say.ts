import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"

const SUBCOMMANDS = {
  SAY: "say",
} as const

const builder = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin-only commands")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.SAY)
      .setDescription("Makes PAL say something in the current channel")
      .addStringOption((option) => option.setName("message").setDescription("Message to send").setRequired(true))
  )

async function handleSaySubcommand(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message")

  if (!message) {
    return interaction.reply({
      ephemeral: true,
      content: "You have to write a message!",
    })
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
}

registerSlashCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.options.getSubcommand()) {
    case SUBCOMMANDS.SAY:
      return handleSaySubcommand(interaction)
    default:
      return interaction.reply({
        content: "Unknown subcommand",
        ephemeral: true,
      })
  }
})
