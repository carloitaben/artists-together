import { ChatInputCommandInteraction } from "discord.js"

import { countPoll, polls } from "~/store/polls"

export default async function handleVotesPollSubcommand(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getString("name", true)

  const poll = polls.get(id)
  if (!poll) throw Error(`Could not find poll with id ${id}`)

  const count = await countPoll(interaction.client, poll)

  if (!count.length) {
    return interaction.reply({
      content: "No one has voted in that poll yet!",
      ephemeral: true,
    })
  }

  const responses = count.map(([k, v]) => `${k}: ${v}`).join("\n")

  return interaction.reply({
    content: `Poll id ${id}:\n${responses}`,
    ephemeral: true,
  })
}
