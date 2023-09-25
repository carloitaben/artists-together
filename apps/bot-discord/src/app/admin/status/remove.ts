import { ChatInputCommandInteraction } from "discord.js"
import { template } from "~/lib/messages"

export default async function handleStatusRemoveSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  try {
    interaction.client.user.presence.set({
      activities: [],
    })

    return interaction.reply({
      content: template.done(),
      ephemeral: true,
    })
  } catch (error) {
    return interaction.reply({
      content: template.oops(),
      ephemeral: true,
    })
  }
}
