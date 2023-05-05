import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

import { countPoll, polls } from "~/store/polls"

export default async function handleVotesPollSubcommand(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getString("name", true)
  const poll = polls.get(id)

  if (!poll) {
    throw Error(`Could not find poll with id ${id}`)
  }

  const count = await countPoll(interaction.client, poll)
  const total = count.reduce((accumulator, [_, value]) => accumulator + value, 0)

  if (!total) {
    return interaction.reply({
      content: "No one has voted in that poll yet!",
      ephemeral: true,
    })
  }

  return interaction.reply({
    content: `Here is the current vote count for the poll "${poll.name}"`,
    ephemeral: true,
    embeds: [
      new EmbedBuilder({
        title: `${poll.name}`,
        footer: {
          text: `Total vote count: ${total}`,
        },
        fields: count.map<APIEmbedField>(([name, value]) => ({
          name,
          value: `${value} vote${value === 1 ? "" : "s"} (${Math.round((value / total) * 100)}%)`,
          inline: false,
        })),
      }),
    ],
  })
}
