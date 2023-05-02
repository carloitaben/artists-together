import { ChatInputCommandInteraction } from "discord.js"

export default async function handleClosePollSubcommand(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name", true)

  return interaction.reply({
    content: `closing poll with id: ${name}`,
    ephemeral: true,
  })
}
