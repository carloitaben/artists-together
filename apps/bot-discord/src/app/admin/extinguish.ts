import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  TextChannel,
} from "discord.js"

import { getTextBasedChannel } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

const BUTTON_IDS = {
  DELETE: "confirm",
  CANCEL: "cancel",
} as const

const deleteButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.DELETE)
  .setStyle(ButtonStyle.Danger)
  .setLabel("Delete all messages")

const cancelButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CANCEL)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("Cancel")

async function deleteAllMessages(channel: TextChannel) {
  const messages = await channel.messages.fetch({ limit: 100 })

  if (messages.size) {
    await Promise.all(messages.map((message) => message.delete()))
    await deleteAllMessages(channel)
  }
}

export default async function handleExtinguishSubcommand(interaction: ChatInputCommandInteraction) {
  const channel = await getTextBasedChannel(interaction.client, CHANNELS.ART_EMERGENCIES)

  if (channel.type !== ChannelType.GuildText) {
    throw Error("Expected ART_EMERGENCIES channel type to be GuildText")
  }

  const response = await interaction.reply({
    content: `This will delete all messages from the ${channel} channel. Are you sure?`,
    ephemeral: true,
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(deleteButton, cancelButton)],
  })

  try {
    const confirmation = await response.awaitMessageComponent({
      time: 60000,
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    })

    switch (confirmation.customId) {
      case BUTTON_IDS.DELETE:
        await confirmation.update({
          content: "Deleting messages…",
          components: [],
        })

        try {
          await deleteAllMessages(channel)
          return confirmation.editReply({
            content: "Done!",
            components: [],
          })
        } catch (error) {
          console.error(error)
          return confirmation.editReply({
            content: "Oops! There was an error while deleting messages.",
            components: [],
          })
        }
      case BUTTON_IDS.CANCEL:
        return confirmation.update({
          content: "Cancelled",
          components: [],
        })
    }
  } catch (error) {
    return response.edit({
      content: "Confirmation not received within 1 minute, cancelling…",
      components: [],
    })
  }
}
