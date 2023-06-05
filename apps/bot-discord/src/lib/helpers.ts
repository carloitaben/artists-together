import { MessageReaction, PartialMessageReaction, Client, GuildMemberManager, RoleManager } from "discord.js"
import { validate, schedule } from "node-cron"

import { ROLES, SERVER_ID } from "~/lib/constants"

export function cron(...args: Parameters<typeof schedule>) {
  validate(args[0])
  return schedule(...args)
}

export function getRandomArrayItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function staticUrl(name: `/${string}.${string}`) {
  return `https://raw.githubusercontent.com/Carloitaben/artists-together/main/apps/bot-discord/static${name}`
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
  return client.guilds.cache.get(SERVER_ID) ?? (await client.guilds.fetch(SERVER_ID))
}

export async function getTextBasedChannel(client: Client, id: string) {
  const channel = client.channels.cache.get(id) ?? (await client.channels.fetch(id))

  if (!channel) {
    throw Error(`Channel with id ${id} not found`)
  }

  if (!channel.isTextBased()) {
    throw Error(`Channel with id ${id} is not text based`)
  }

  return channel
}

export async function getMember<T extends GuildMemberManager>(manager: T, id: string) {
  const member = manager.cache.get(id) ?? (await manager.fetch(id))

  if (!member) {
    throw Error(`Member with id ${id} not found`)
  }

  return member
}

export async function getRole<T extends RoleManager>(manager: T, id: string) {
  const role = manager.cache.get(id) ?? (await manager.fetch(id))

  if (!role) {
    throw Error(`Role with id ${id} not found`)
  }

  return role
}

export async function parseMentions(manager: RoleManager, text: string) {
  // Early bail out if string is empty
  if (!text) return text

  // Early bail out if no mentions are found
  if (!text.includes("@")) return text

  const roles = await Promise.all(
    Object.entries(ROLES).map(async ([name, id]) => {
      const role = await getRole(manager, id)
      return [`@${name}`, role] as const
    })
  )

  return roles.reduce((text, [mention, role]) => {
    return text.replaceAll(mention, role.toString())
  }, text)
}
