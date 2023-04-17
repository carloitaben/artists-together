import { Client } from "discord.js"
import { APPLICATION_ID, CHANNELS } from "~/lib/constants"
import { getChannel, getChannelMessages } from "~/lib/helpers"

export default async function init(client: Client) {
  const channel = await getChannel(client, CHANNELS.SERVER_MAP_AND_ROLES)
  if (!channel) throw Error("Missing SERVER_MAP_AND_ROLES channel")

  await channel.fetch(true)

  const messages = await getChannelMessages(channel)
  console.log(messages.length)

  const pronounsMessage = messages.find((message) => {
    const authorIsPal = message.author.id === APPLICATION_ID
    console.log(message.embeds[0].description)
    const embedContentMatches = message.embeds[0].description?.startsWith(
      "React to this message to add your preferred pronouns to your roles!"
    )

    return authorIsPal && embedContentMatches
  })

  if (!pronounsMessage) {
    console.log("create pronouns message")
  } else {
    console.log("Skip pronouns message creation")
  }
}
