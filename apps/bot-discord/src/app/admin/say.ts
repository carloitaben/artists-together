import { ChatInputCommandInteraction } from "discord.js"

export default async function handleSaySubcommand(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message")
  const attachment = interaction.options.getAttachment("attachment")

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  if (!message && !attachment) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot send an empty message!",
    })
  }

  await interaction.channel.send({
    content: message ?? undefined,
    files: attachment ? [attachment.url] : undefined,
  })

  return interaction.reply({
    content: "Done!",
    ephemeral: true,
  })
}
