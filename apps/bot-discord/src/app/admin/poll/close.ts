import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "discord.js"

import { closePoll, polls } from "./lib/polls"
import { template } from "~/lib/messages"

const BUTTON_IDS = {
  CLOSE: "poll-close-button-close",
  CANCEL: "poll-close-button-cancel",
} as const

const closeButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CLOSE)
  .setStyle(ButtonStyle.Primary)
  .setLabel("Close poll")

const cancelButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CANCEL)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("Cancel")

export default async function handleClosePollSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  const id = interaction.options.getString("name", true)
  const poll = polls.get(id)

  if (!poll) {
    throw Error(`Could not find cached poll with id ${id}`)
  }

  console.log("[admin-poll-close-command] are you sure you want to close")
  const response = await interaction.reply({
    content: `Are you sure you want to close the poll "${poll.name}"? This cannot be undone!`,
    ephemeral: true,
    fetchReply: true,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        closeButton,
        cancelButton,
      ),
    ],
  })

  try {
    const confirmation = await response.awaitMessageComponent({
      time: 60_000,
    })

    if (!confirmation.channel) {
      throw Error("Expected channel property on confirmation interaciton")
    }

    switch (confirmation.customId) {
      case BUTTON_IDS.CANCEL:
        return confirmation.update({
          content: template.cancel(),
          embeds: [],
          components: [],
        })
      case BUTTON_IDS.CLOSE:
        await closePoll(interaction.client, poll)

        return confirmation.update({
          content: template.done(),
          embeds: [],
          components: [],
        })
    }
  } catch (error) {
    await response.edit({
      content: "Confirmation not received within 1 minute, cancelling",
      embeds: [],
      components: [],
    })
  }
}
