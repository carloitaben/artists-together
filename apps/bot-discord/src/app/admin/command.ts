import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"
import { template } from "~/lib/messages"

import handleExtinguishSubcommand from "./extinguish"
import handleSendMessageSubcommand from "./send/message"
import handleSendEmbedSubcommand from "./send/embed"
import handleAutocompletePoll from "./poll/autocomplete"
import handleCreatePollSubcommand from "./poll/create"
import handleClosePollSubcommand from "./poll/close"
import handleVotesPollSubcommand from "./poll/votes"

const SUBCOMMANDS = {
  EXTINGUISH: "extinguish",
  SEND: {
    MESSAGE: "message",
    EMBED: "embed",
  },
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
        subcommand
          .setName(SUBCOMMANDS.POLL.CREATE)
          .setDescription("Creates a poll in the current channel"),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.POLL.VOTES)
          .setDescription("Gets the votes of a poll")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("Poll name")
              .setAutocomplete(true)
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.POLL.CLOSE)
          .setDescription("Closes a currently opened poll")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("Poll name")
              .setAutocomplete(true)
              .setRequired(true),
          ),
      ),
  )
  .addSubcommandGroup((group) =>
    group
      .setName("send")
      .setDescription("Makes PAL send something in the current channel")
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.SEND.MESSAGE)
          .setDescription("Send a text message as PAL in the current channel")
          .addStringOption((option) =>
            option.setName("message").setDescription("Message to send"),
          )
          .addAttachmentOption((option) =>
            option.setName("attachment").setDescription("Optional attatchment"),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.SEND.EMBED)
          .setDescription("Send an embed as PAL in the current channel"),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.EXTINGUISH)
      .setDescription("Removes all messages from ART emergencies"),
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
      case SUBCOMMANDS.SEND.MESSAGE:
        return handleSendMessageSubcommand(interaction)
      case SUBCOMMANDS.SEND.EMBED:
        return handleSendEmbedSubcommand(interaction)
      default:
        console.log("[admin-slash-command] unknown interaction")
        return interaction.reply({
          content: template.oops("Unknown subcommand"),
          ephemeral: true,
        })
    }
  }
})
