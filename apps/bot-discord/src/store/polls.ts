import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { Client } from "discord.js"
import { InferModel, connect, discordPolls, eq } from "db"

import { registerEventHandler } from "~/lib/core"
import { getTextBasedChannel } from "~/lib/helpers"

dayjs.extend(isSameOrAfter)

type DiscordPoll = InferModel<typeof discordPolls>

export const polls = new Map<number, DiscordPoll>()

export async function deletePoll(poll: DiscordPoll) {
  const db = connect()
  await db.delete(discordPolls).where(eq(discordPolls.id, poll.id))
  return polls.delete(poll.id)
}

export async function closePoll(client: Client, poll: DiscordPoll) {
  const channel = await getTextBasedChannel(client, poll.channelId)
  const message = await channel.messages.fetch(poll.messageId)

  // If the message no longer exists, delete the poll
  if (!message) return deletePoll(poll)

  // TODO: decide what do we do here
  // By default we try to reuse the existing poll message
  // but it might not be possible
  if (message.editable) {
    await message.edit({
      content: "FETCH POLL RESULTS AND SHOW THEM HERE!!!",
      components: [],
    })
  } else {
    Promise.all([
      message.delete(),
      channel.send({
        content: "FETCH POLL RESULTS AND SHOW THEM HERE!!!",
        components: [],
      }),
    ])
  }

  return deletePoll(poll)
}

async function trackPoll(client: Client, poll: DiscordPoll) {
  if (!poll.deadline) return

  // Close polls that are dead as of now
  const dead = dayjs().isSameOrAfter(dayjs(poll.deadline))
  if (dead) return closePoll(client, poll)

  // Close future polls
  const ms = dayjs(poll.deadline).diff(dayjs(), "ms")
  setTimeout(() => closePoll(client, poll), ms)
}

export async function addPoll(client: Client, poll: InferModel<typeof discordPolls, "insert">) {
  const db = connect()
  await db.insert(discordPolls).values(poll)
  const [dbPoll] = await db.select().from(discordPolls).where(eq(discordPolls.name, poll.name)).limit(1)
  polls.set(dbPoll.id, dbPoll)

  await trackPoll(client, dbPoll)

  return dbPoll
}

// Populate cache on initialization and track poll deadlines
registerEventHandler("ready", async (client) => {
  const db = connect()
  const dbPolls = await db.select().from(discordPolls)
  dbPolls.forEach((poll) => polls.set(poll.id, poll))

  const trackable = dbPolls.filter((poll) => poll.deadline)
  trackable.forEach((poll) => trackPoll(client, poll))
})

// If a message with a poll is deleted, remove the poll from both db and cache
registerEventHandler("messageDelete", async (message) => {
  polls.forEach(async (poll) => {
    if (poll.messageId !== message.id) return
    if (poll.channelId !== message.channel.id) return
    return deletePoll(poll)
  })
})
