import { ChatInputCommandInteraction } from "discord.js"

export default async function handleSaySubcommand(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message")

  if (!message) {
    return interaction.reply({
      ephemeral: true,
      content: "You have to write a message!",
    })
  }

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  await Promise.all([
    interaction.channel.send(message),
    interaction.reply({
      content: "Done!",
      ephemeral: true,
    }),
  ])
}
