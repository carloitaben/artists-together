import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"

import handleSaySubcommand from "./say"
import handleExtinguishSubcommand from "./extinguish"

const SUBCOMMANDS = {
  SAY: "say",
  EXTINGUISH: "extinguish",
} as const

const builder = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin-only commands")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.SAY)
      .setDescription("Makes PAL say something in the current channel")
      .addStringOption((option) => option.setName("message").setDescription("Message to send"))
      .addAttachmentOption((option) => option.setName("attachment").setDescription("Optional attatchment"))
  )
  .addSubcommand((subcommand) =>
    subcommand.setName(SUBCOMMANDS.EXTINGUISH).setDescription("Removes all messages from ART emergencies")
  )

registerSlashCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.options.getSubcommand()) {
    case SUBCOMMANDS.SAY:
      return handleSaySubcommand(interaction)
    case SUBCOMMANDS.EXTINGUISH:
      return handleExtinguishSubcommand(interaction)
    default:
      return interaction.reply({
        content: "Unknown subcommand",
        ephemeral: true,
      })
  }
})
