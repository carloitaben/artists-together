import { ActivityType, ChatInputCommandInteraction } from "discord.js"
import { template } from "~/lib/messages"

export default async function handleStatusSetSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  const status = interaction.options.getString("status", true)

  try {
    interaction.client.user.presence.set({
      activities: [
        {
          type: ActivityType.Custom,
          name: status,
        },
      ],
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
