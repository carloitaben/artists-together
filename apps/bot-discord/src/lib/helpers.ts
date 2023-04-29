import { MessageReaction, PartialMessageReaction, Client, GuildMemberManager, RoleManager } from "discord.js"

import type { Channel, ROLES } from "~/lib/constants"
import { env } from "~/lib/env"

export async function getReactionFromPartial(reaction: MessageReaction | PartialMessageReaction) {
  if (!reaction.partial) return reaction

  try {
    return reaction.fetch()
  } catch (error) {
    throw Error(`Something went wrong when fetching the reaction: ${error}`)
  }
}

export async function getGuild(client: Client) {
  return client.guilds.cache.get(env.DISCORD_SERVER_ID) ?? (await client.guilds.fetch(env.DISCORD_SERVER_ID))
}

export async function getTextBasedChannel(client: Client, id: Channel) {
  const channel = client.channels.cache.get(id) ?? (await client.channels.fetch(id))
  if (!channel) throw Error(`Channel with id ${id} not found`)
  if (!channel.isTextBased()) throw Error(`Channel with id ${id} is not text based`)
  return channel
}

export async function getMember<T extends GuildMemberManager>(manager: T, id: string) {
  const member = manager.cache.get(id) ?? (await manager.fetch(id))
  if (!member) throw Error(`Member with id ${id} not found`)
  return member
}

export async function getRole<T extends RoleManager>(manager: T, id: string) {
  const role = manager.cache.get(id) ?? (await manager.fetch(id))
  if (!role) throw Error(`Role with id ${id} not found`)
  return role
}
