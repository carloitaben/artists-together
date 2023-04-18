import { MessageReaction, PartialMessageReaction, Client } from "discord.js"

export async function getReactionFromPartial(reaction: MessageReaction | PartialMessageReaction) {
  if (!reaction.partial) return reaction

  try {
    return reaction.fetch()
  } catch (error) {
    throw Error(`Something went wrong when fetching the reaction: ${error}`)
  }
}

export async function getGuild(client: Client) {
  return (
    client.guilds.cache.get(process.env.DISCORD_SERVER_ID) ?? (await client.guilds.fetch(process.env.DISCORD_SERVER_ID))
  )
}
