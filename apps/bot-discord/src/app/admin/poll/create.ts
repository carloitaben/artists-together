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
import { DiscordPolls } from "db"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"

import { registerEventHandler } from "~/lib/core"
import { parseMentions } from "~/lib/helpers"
import { template } from "~/lib/messages"

import { addPoll } from "./lib/polls"
import { encodeButtonVoteOptionId } from "./lib/utils"

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

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

function isValidColor(color: string) {
  return /^#[0-9A-F]{6}$/i.test(color)
}

export default async function handleCreatePollSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  if (!interaction.channel || !("name" in interaction.channel)) {
    console.log("[admin-poll-create-command] cannot create a poll")
    return interaction.reply({
      content: template.oops("I cannot create a poll in this channel"),
      ephemeral: true,
    })
  }

  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID)
    .setTitle(`New poll in #${interaction.channel.name}`)

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
    .setPlaceholder(
      "🪐 2001: A Space Odyssey" +
        "\n" +
        `🌪️ Gone with the Wind` +
        "\n" +
        `🧙‍♀️ The Wizard of Oz`,
    )

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(durationInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(optionsInput),
  )

  return interaction.showModal(modal)
}

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (interaction.customId !== MODAL_ID) return

  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Missing channel property in modal interaction")
  }

  const optionsInput = interaction.fields.getTextInputValue(INPUT_IDS.OPTIONS)
  const titleInput = interaction.fields.getTextInputValue(INPUT_IDS.TITLE)
  const durationInput = interaction.fields.getTextInputValue(INPUT_IDS.DURATION)
  const colorInput =
    interaction.fields.getTextInputValue(INPUT_IDS.COLOR) || "#f4f4f4"
  const descriptionInput = interaction.fields.getTextInputValue(
    INPUT_IDS.DESCRIPTION,
  )

  if (!isValidColor(colorInput)) {
    return interaction.reply({
      content: template.oops(
        `The color code ${colorInput} doesn't seem to be valid`,
      ),
      ephemeral: true,
    })
  }

  const options = optionsInput.split("\n").filter((option) => option)

  if (options.length < 2) {
    return interaction.reply({
      content: template.oops("I need at least two options to create a poll"),
      ephemeral: true,
    })
  }

  const endDate = durationInput
    ? parseDate(durationInput, new Date(), { forwardDate: true })
    : undefined

  if (durationInput && !endDate) {
    return interaction.reply({
      content: template.oops(
        `${durationInput} doesn't seem like a valid duration`,
      ),
      ephemeral: true,
    })
  }

  if (endDate) {
    const diff = dayjs(endDate).diff(dayjs(), "seconds")

    if (diff <= 10) {
      return interaction.reply({
        content: template.oops(
          `I cannot create a poll with a duration that short`,
        ),
        ephemeral: true,
      })
    }
  }

  const nameUnavailable = await DiscordPolls.listFromChannel(
    interaction.channel.id,
  ).then((polls) => Boolean(polls.some((poll) => poll.name === titleInput)))

  if (nameUnavailable) {
    return interaction.reply({
      content:
        template.oops(
          `A poll with the title "${titleInput}" already exists on this channel`,
        ) +
        "\n" +
        "\n" +
        "You could…" +
        "\n" +
        "✱ Close that poll using the `/admin poll close` command" +
        "\n" +
        "✱ Pick a different title for this poll" +
        "\n" +
        "✱ Create this poll in a different channel",
      ephemeral: true,
    })
  }

  const description = await parseMentions(
    interaction.guild.roles,
    descriptionInput,
  )

  console.log("[admin-poll-create-command] sending confirmation")
  const response = await interaction.reply({
    content: "Opening the following poll in this channel. Sound good?",
    ephemeral: true,
    fetchReply: true,
    embeds: [
      new EmbedBuilder({
        title: titleInput,
        description,
        footer: endDate && {
          text: `Closes on ${dayjs.utc(endDate).format("lll")} UTC`,
        },
        fields: options.map((option, index) => ({
          name: `Option ${index + 1}: ${option}`,
          value: "",
          inline: false,
        })),
      }).setColor(colorInput as `#${string}`),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        createButton,
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
      case BUTTON_IDS.CREATE:
        const id = nanoid()

        const buttons = options.map((option, index) =>
          new ButtonBuilder()
            .setCustomId(encodeButtonVoteOptionId(id, index))
            .setStyle(ButtonStyle.Secondary)
            .setLabel(option),
        )

        const pollMessage = await confirmation.channel.send({
          content: "🗳️  **Poll**",
          embeds: [
            new EmbedBuilder({
              title: titleInput,
              description,
              footer: {
                text: `0 votes in total${
                  endDate
                    ? `\nCloses on ${dayjs.utc(endDate).format("lll")} UTC`
                    : ""
                }`,
              },
            }).setColor(colorInput as `#${string}`),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })

        await addPoll({
          channelId: confirmation.channel.id,
          messageId: pollMessage.id,
          name: titleInput,
          deadline: endDate,
          id,
        })

        return confirmation.update({
          content: template.done(),
          embeds: [],
          components: [],
        })
    }
  } catch (error) {
    await response.edit({
      content: template.timeout(),
      embeds: [],
      components: [],
    })
  }
})
