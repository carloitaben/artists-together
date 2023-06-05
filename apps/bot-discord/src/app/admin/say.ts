import { ChatInputCommandInteraction } from "discord.js"
import { parseMentions } from "~/lib/helpers"

export default async function handleSaySubcommand(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message")
  const attachment = interaction.options.getAttachment("attachment")

  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  if (!message && !attachment) {
    return interaction.reply({
      ephemeral: true,
      content: "I cannot send an empty message!",
    })
  }

  const parsedMessage = await parseMentions(interaction.guild.roles, message || "")

  await interaction.channel.send({
    content: parsedMessage,
    files: attachment ? [attachment.url] : undefined,
  })

  return interaction.reply({
    content: "Done!",
    ephemeral: true,
  })
}
