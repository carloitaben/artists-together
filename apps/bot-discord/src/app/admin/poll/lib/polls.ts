import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { DiscordPolls } from "db"
import { Client, EmbedBuilder } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { getTextBasedChannel } from "~/lib/helpers"

import { formatVotes } from "./utils"

dayjs.extend(isSameOrAfter)

export const polls = new Map<string, DiscordPolls.PollsSchema>()

export async function deletePoll(id: DiscordPolls.PollsSchema["id"]) {
  return DiscordPolls.remove(id).then(() => polls.delete(id))
}

export async function countPoll(
  client: Client,
  poll: DiscordPolls.PollsSchema,
) {
  const channel = await getTextBasedChannel(client, poll.channelId)
  const message = await channel.messages.fetch(poll.messageId)
  const options = message.components[0].components

  const votes = await DiscordPolls.votesFromId(poll.id)
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

export async function closePoll(
  client: Client,
  poll: DiscordPolls.PollsSchema,
) {
  const channel = await getTextBasedChannel(client, poll.channelId)
  const message = await channel.messages.fetch(poll.messageId)

  // If the message no longer exists, delete the poll
  if (!message) return deletePoll(poll.id)

  const count = await countPoll(client, poll)
  const total = count.reduce(
    (accumulator, [_, value]) => accumulator + value,
    0,
  )
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

  return deletePoll(poll.id)
}

export async function addPoll(poll: DiscordPolls.PollsSchema) {
  await DiscordPolls.create(poll)
  const dbPoll = await DiscordPolls.fromName(poll.name)
  polls.set(dbPoll.id, dbPoll)
  return dbPoll
}

// Populate cache on initialization and track poll deadlines
registerEventHandler("ready", async (client) => {
  await DiscordPolls.list().then((dbPolls) =>
    dbPolls.forEach((dbPoll) => polls.set(dbPoll.id, dbPoll)),
  )

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
    return deletePoll(poll.id)
  })
})
