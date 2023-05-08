import { and, connect, discordPollVotes, eq } from "db"

import { registerEventHandler } from "~/lib/core"
import { polls } from "~/store/polls"

import { BUTTON_OPTION_PREFIX, decodeButtonVoteOptionId } from "./lib/utils"

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return
  if (!interaction.customId.startsWith(BUTTON_OPTION_PREFIX)) return

  const { pollId, optionIndex } = decodeButtonVoteOptionId(interaction.customId)
  const poll = polls.get(String(pollId))

  if (!poll) {
    throw Error(`Could not find cached poll with id ${pollId}`)
  }

  const db = connect()
  const [existingUserVote] = await db
    .select()
    .from(discordPollVotes)
    .where(and(eq(discordPollVotes.pollId, poll.id), eq(discordPollVotes.userId, interaction.user.id)))
    .limit(1)

  if (existingUserVote) {
    if (existingUserVote.answer === optionIndex) {
      return interaction.reply({
        content: "Your vote has been casted! 🎉\nThank you for participating ❤️",
        ephemeral: true,
      })
    }

    await db.update(discordPollVotes).set({ answer: optionIndex }).where(eq(discordPollVotes.id, existingUserVote.id))

    return interaction.reply({
      content: "Your vote has been casted! 🎉\nThank you for participating ❤️",
      ephemeral: true,
    })
  }

  await db.insert(discordPollVotes).values({
    pollId: poll.id,
    userId: interaction.user.id,
    answer: optionIndex,
  })

  return interaction.reply({
    content: "Your vote has been casted! 🎉\nThank you for participating ❤️",
    ephemeral: true,
  })
})
