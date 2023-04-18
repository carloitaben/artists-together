import { User, PartialUser, MessageReaction, PartialMessageReaction, Client, Message, Channel } from "discord.js"

export async function getUserFromPartial(user: User | PartialUser) {
  if (!user.partial) return user

  try {
    return user.fetch()
  } catch (error) {
    throw Error(`Something went wrong when fetching the user: ${error}`)
  }
}

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

export async function getChannel(client: Client, channelId: string) {
  return client.channels.cache.get(channelId) ?? (await client.channels.fetch(channelId))
}

export async function getChannelMessages(channel: Channel) {
  if (!channel.isTextBased()) {
    throw Error(`Channel with id ${channel.id} is not text based`)
  }

  const messages: Message[] = []
  const firstBatch = await channel.messages.fetch({ limit: 1 })

  let pointer = firstBatch.size === 1 ? firstBatch.at(0) : null

  while (pointer) {
    const nextBatch = await channel.messages.fetch({
      limit: 100,
      before: pointer.id,
    })

    nextBatch.forEach((m) => messages.push(m))
    pointer = nextBatch.size ? nextBatch.at(nextBatch.size - 1) : null
  }

  return messages
}
