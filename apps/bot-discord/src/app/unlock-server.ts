import { CHANNELS, ROLES } from "~/lib/constants"
import { registerEventHandler } from "~/lib/core"

registerEventHandler("messageCreate", async (message) => {
  if (!message.inGuild()) return
  if (message.author.bot) return
  if (message.channelId !== CHANNELS.INTRODUCTIONS) return

  try {
    const member = await message.guild.members.fetch(message.author.id)
    member.roles.add(ROLES.FRIEND)
  } catch (error) {
    console.error(error)
  }
})
