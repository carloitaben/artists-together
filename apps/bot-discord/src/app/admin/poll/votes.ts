import { ChatInputCommandInteraction } from "discord.js"
import { connect, discordPollVotes, eq } from "db"

import { polls } from "~/store/polls"

export default async function handleVotesPollSubcommand(interaction: ChatInputCommandInteraction) {
  const id = parseInt(interaction.options.getString("name", true))

  const poll = polls.get(id)
  if (!poll) throw Error(`Could not find poll with id ${id}`)

  const db = connect()
  const votes = await db.select().from(discordPollVotes).where(eq(discordPollVotes.pollId, id))

  console.log(votes)

  if (!votes.length) {
    return interaction.reply({
      content: "No one has voted in that poll yet!",
      ephemeral: true,
    })
  }

  return interaction.reply({
    content: `Found ${votes.length} for poll with id: ${id}`,
    ephemeral: true,
  })
}
