import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { Client, EmbedBuilder } from "discord.js"
import { InferModel, connect, discordPollVotes, discordPolls, eq } from "db"

import { formatVotes } from "~/app/admin/poll/lib/utils"
import { registerEventHandler } from "~/lib/core"
import { getTextBasedChannel } from "~/lib/helpers"

dayjs.extend(isSameOrAfter)

type DiscordPoll = InferModel<typeof discordPolls>

export const polls = new Map<string, DiscordPoll>()

export async function deletePoll(poll: DiscordPoll) {
  const db = connect()
  const deletePollPromise = db.delete(discordPolls).where(eq(discordPolls.id, poll.id))
  const deleteVotesPromise = db.delete(discordPollVotes).where(eq(discordPollVotes.pollId, poll.id))

  await Promise.all([deletePollPromise, deleteVotesPromise])

  return polls.delete(poll.id)
}

export async function countPoll(client: Client, poll: DiscordPoll) {
  const channel = await getTextBasedChannel(client, poll.channelId)
  const message = await channel.messages.fetch(poll.messageId)

  const options = message.components[0].components

  const db = connect()
  const votes = await db.select().from(discordPollVotes).where(eq(discordPollVotes.pollId, poll.id))

  const votesCountMap = new Map<string, number>()

  options.forEach((option) => {
    if (!("label" in option)) {
      throw Error("Expected label property on button")
    }

    const optionLabel = String(option.label)
    votesCountMap.set(optionLabel, 0)
  })

  const votesCount = votes.reduce((accumulator, vote) => {
    const option = options[vote.answer]

    if (!("label" in option)) {
      throw Error("Expected label property on button")
    }

    const optionLabel = String(option.label)
    const voteCount = accumulator.get(optionLabel)

    if (typeof voteCount === "undefined") {
      return accumulator.set(optionLabel, 1)
    }

    accumulator.set(optionLabel, voteCount + 1)
    return accumulator
  }, votesCountMap)

  return Array.from(votesCount)
}

export async function closePoll(client: Client, poll: DiscordPoll) {
  const channel = await getTextBasedChannel(client, poll.channelId)
  const message = await channel.messages.fetch(poll.messageId)

  // If the message no longer exists, delete the poll
  if (!message) return deletePoll(poll)

  const count = await countPoll(client, poll)
  const total = count.reduce((accumulator, [_, value]) => accumulator + value, 0)
  const embed = new EmbedBuilder({
    title: `${poll.name}`,
    footer: {
      text: `${total} vote${total === 1 ? "" : "s"} in total`,
    },
    fields: formatVotes(count),
  })

  // By default we try to reuse the existing poll message
  // but it might not be possible if it's too old,
  // so we delete it and create another
  if (message.editable) {
    await message.edit({
      content: "🗳️  **Poll results**",
      components: [],
      embeds: [embed],
    })
  } else {
    Promise.all([
      message.delete(),
      channel.send({
        content: "🗳️  **Poll results**",
        embeds: [embed],
      }),
    ])
  }

  return deletePoll(poll)
}

export async function addPoll(client: Client, poll: InferModel<typeof discordPolls, "insert">) {
  const db = connect()
  await db.insert(discordPolls).values(poll)
  const [dbPoll] = await db.select().from(discordPolls).where(eq(discordPolls.name, poll.name)).limit(1)
  polls.set(dbPoll.id, dbPoll)
  return dbPoll
}

// Populate cache on initialization and track poll deadlines
registerEventHandler("ready", async (client) => {
  const db = connect()
  const dbPolls = await db.select().from(discordPolls)
  dbPolls.forEach((poll) => polls.set(poll.id, poll))

  // Track polls
  setInterval(() => {
    polls.forEach((poll) => {
      if (!poll.deadline) return
      const dead = dayjs().isSameOrAfter(dayjs(poll.deadline))
      if (dead) closePoll(client, poll)
    })
  }, 10_000)
})

// If a message with a poll is deleted, remove the poll from both db and cache
registerEventHandler("messageDelete", async (message) => {
  polls.forEach(async (poll) => {
    if (poll.messageId !== message.id) return
    if (poll.channelId !== message.channel.id) return
    return deletePoll(poll)
  })
})
