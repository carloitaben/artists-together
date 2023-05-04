import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { parseDate } from "chrono-node"
import { nanoid } from "nanoid"

import { registerEventHandler } from "~/lib/core"
import { addPoll } from "~/store/polls"

const MODAL_ID = "admin-poll"

const INPUT_IDS = {
  TITLE: `${MODAL_ID}-title`,
  COLOR: `${MODAL_ID}-color`,
  DURATION: `${MODAL_ID}-duration`,
  DESCRIPTION: `${MODAL_ID}-description`,
  OPTIONS: `${MODAL_ID}-options`,
}

const BUTTON_IDS = {
  CREATE: `${MODAL_ID}-button-create`,
  CANCEL: `${MODAL_ID}-button-cancel`,
} as const

const createButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CREATE)
  .setStyle(ButtonStyle.Primary)
  .setLabel("Create poll")

const cancelButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CANCEL)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("Cancel")

export default async function handleCreatePollSubcommand(interaction: ChatInputCommandInteraction) {
  if (!interaction.channel || !("name" in interaction.channel)) {
    return interaction.reply({
      content: "Oops! I cannot create a poll in this channel",
      ephemeral: true,
    })
  }

  const modal = new ModalBuilder().setCustomId(MODAL_ID).setTitle(`New poll in #${interaction.channel.name}`)

  const titleInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.TITLE)
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setLabel("Title")
    .setPlaceholder("Movie night")

  const colorInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.COLOR)
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setLabel("Color (in hexadecimal)")
    .setPlaceholder("#3924ff")

  const durationInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.DURATION)
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setLabel("Duration (leave empty to run indefinitely)")
    .setPlaceholder("An hour and a half, 3 days, a week from now…")

  const descriptionInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.DESCRIPTION)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setLabel("Description (supports Markdown)")
    .setPlaceholder("Help us decide what movie we'll be watching tonight!")

  const optionsInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.OPTIONS)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setLabel("Options (each line will be a new option)")
    .setPlaceholder("🪐 2001: A Space Odyssey" + "\n" + `🌪️ Gone with the Wind` + "\n" + `🧙‍♀️ The Wizard of Oz`)

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(durationInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(optionsInput)
  )

  return interaction.showModal(modal)
}

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (interaction.customId !== MODAL_ID) return

  if (!interaction.channel) {
    throw Error("Missing channel property in modal interaction")
  }

  const titleInput = interaction.fields.getTextInputValue(INPUT_IDS.TITLE)
  const colorInput = interaction.fields.getTextInputValue(INPUT_IDS.COLOR) || "#3924ff"
  const durationInput = interaction.fields.getTextInputValue(INPUT_IDS.DURATION)
  const descriptionInput = interaction.fields.getTextInputValue(INPUT_IDS.DESCRIPTION)
  const optionsInput = interaction.fields.getTextInputValue(INPUT_IDS.OPTIONS)

  const options = optionsInput.split("\n").filter((option) => option)

  if (!colorInput.startsWith("#")) {
    return interaction.reply({
      content: `Oops! The color code ${colorInput} doesn't seem to be valid 😅`,
      ephemeral: true,
    })
  }

  if (options.length < 2) {
    return interaction.reply({
      content: "Oops! I need at least two options to create a poll 😅",
      ephemeral: true,
    })
  }

  const endDate = durationInput ? parseDate(durationInput, new Date(), { forwardDate: true }) : undefined

  if (durationInput && !endDate) {
    return interaction.reply({
      content: `Oops! ${durationInput} doesn't seem like a valid duration 😅`,
      ephemeral: true,
    })
  }

  const response = await interaction.reply({
    content: `I'll create a poll on this channel with the following data. The poll will run until ${
      endDate ? endDate.toISOString() : "an admin decides to close it"
    }. Is it ok?`,
    ephemeral: true,
    fetchReply: true,
    embeds: [
      new EmbedBuilder({
        title: titleInput,
        description: descriptionInput,
        footer: {
          text: `Poll open until ${endDate ? endDate.toISOString() : "manually closed"}`,
        },
        fields: options.map((option, index) => ({
          name: `Option ${index + 1}: ${option}`,
          value: "",
          inline: false,
        })),
      }).setColor(colorInput as `#${string}`),
    ],
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createButton, cancelButton)],
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
          content: "Cancelled",
          embeds: [],
          components: [],
        })
      case BUTTON_IDS.CREATE:
        const id = nanoid()

        const buttons = options.map((option, index) =>
          new ButtonBuilder().setCustomId(`poll-button-${index}`).setStyle(ButtonStyle.Secondary).setLabel(option)
        )

        const pollMessage = await confirmation.channel.send({
          nonce: id,
          embeds: [
            new EmbedBuilder({
              title: titleInput,
              description: descriptionInput,
              footer: {
                text: endDate ? `Poll open until ${endDate.toISOString()}` : "",
              },
            }).setColor(colorInput as `#${string}`),
          ],
          components: [new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)],
        })

        await addPoll(interaction.client, {
          channelId: confirmation.channel.id,
          messageId: pollMessage.id,
          name: titleInput,
          deadline: endDate,
          id,
        })

        return confirmation.update({
          content: "Done!",
          embeds: [],
          components: [],
        })
    }
  } catch (e) {
    await response.edit({
      content: "Confirmation not received within 1 minute, cancelling",
      embeds: [],
      components: [],
    })
  }
})
