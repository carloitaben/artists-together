import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"

import handleSaySubcommand from "./say"
import handleExtinguishSubcommand from "./extinguish"
import handleAutocompletePoll from "./poll/autocomplete"
import handleCreatePollSubcommand from "./poll/create"
import handleClosePollSubcommand from "./poll/close"
import handleVotesPollSubcommand from "./poll/votes"

const SUBCOMMANDS = {
  EXTINGUISH: "extinguish",
  SAY: "say",
  POLL: {
    CREATE: "create",
    VOTES: "votes",
    CLOSE: "close",
  },
} as const

const builder = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin-only commands")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommandGroup((group) =>
    group
      .setName("poll")
      .setDescription("Poll-related commands")
      .addSubcommand((subcommand) =>
        subcommand.setName(SUBCOMMANDS.POLL.CREATE).setDescription("Creates a poll in the current channel")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.POLL.VOTES)
          .setDescription("Gets the votes of a poll")
          .addStringOption((option) =>
            option.setName("name").setDescription("Poll name").setAutocomplete(true).setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.POLL.CLOSE)
          .setDescription("Closes a currently opened poll")
          .addStringOption((option) =>
            option.setName("name").setDescription("Poll name").setAutocomplete(true).setRequired(true)
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName(SUBCOMMANDS.EXTINGUISH).setDescription("Removes all messages from ART emergencies")
  ) 
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.SAY)
      .setDescription("Makes PAL say something in the current channel")
      .addStringOption((option) => option.setName("message").setDescription("Message to send"))
      .addAttachmentOption((option) => option.setName("attachment").setDescription("Optional attatchment"))
  )

registerSlashCommand(builder, async (interaction) => {
  if (interaction.isAutocomplete()) {
    switch (interaction.options.getSubcommand()) {
      case SUBCOMMANDS.POLL.VOTES:
      case SUBCOMMANDS.POLL.CLOSE:
        return handleAutocompletePoll(interaction)
      default:
        return
    }
  }

  if (interaction.isChatInputCommand()) {
    switch (interaction.options.getSubcommand()) {
      case SUBCOMMANDS.EXTINGUISH:
        return handleExtinguishSubcommand(interaction)
      case SUBCOMMANDS.POLL.CREATE:
        return handleCreatePollSubcommand(interaction)
      case SUBCOMMANDS.POLL.VOTES:
        return handleVotesPollSubcommand(interaction)
      case SUBCOMMANDS.POLL.CLOSE:
        return handleClosePollSubcommand(interaction)
      case SUBCOMMANDS.SAY:
        return handleSaySubcommand(interaction)
      default:
        return interaction.reply({
          content: "Unknown subcommand",
          ephemeral: true,
        })
    }
  }
})
