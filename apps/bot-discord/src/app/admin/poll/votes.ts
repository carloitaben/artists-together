import { ChatInputCommandInteraction } from "discord.js"

export default async function handleVotesPollSubcommand(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name", true)

  return interaction.reply({
    content: `Checking poll stats for poll with id: ${name}`,
    ephemeral: true,
  })
}
