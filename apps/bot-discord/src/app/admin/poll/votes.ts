import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

import { countPoll, polls } from "./lib/polls"
import { formatVotes } from "./lib/utils"

export default async function handleVotesPollSubcommand(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getString("name", true)
  const poll = polls.get(id)

  if (!poll) {
    throw Error(`Could not find poll with id ${id}`)
  }

  const count = await countPoll(interaction.client, poll)
  const total = count.reduce((accumulator, [_, value]) => accumulator + value, 0)

  if (!total) {
    console.log("[admin-poll-votes] missing total")
    return interaction.reply({
      content: "No one has voted in that poll yet!",
      ephemeral: true,
    })
  }

  console.log("[admin-poll-votes] replying with total")
  return interaction.reply({
    content: "🗳️  **Poll vote count**",
    ephemeral: true,
    embeds: [
      new EmbedBuilder({
        title: `${poll.name}`,
        footer: {
          text: `${total} vote${total === 1 ? "" : "s"} in total`,
        },
        fields: formatVotes(count),
      }),
    ],
  })
}
