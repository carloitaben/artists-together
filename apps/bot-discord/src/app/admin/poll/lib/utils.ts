import { APIEmbedField } from "discord.js"
import { countPoll } from "~/store/polls"

export const BUTTON_OPTION_PREFIX = "poll-button-"

export function encodeButtonVoteOptionId(pollId: string, buttonIndex: number) {
  const key = `${BUTTON_OPTION_PREFIX}@@${pollId}@@${buttonIndex}`
  return key
}

export function decodeButtonVoteOptionId(buttonId: string) {
  const [_, pollId, optionIndex] = buttonId.split("@@")

  return {
    pollId,
    optionIndex: parseInt(optionIndex),
  }
}

const VOTE_BAR_FILL = "█"
const VOTE_VAR_EMPTY = "░"
const VOTE_BAR_WIDTH = 10

export function formatVotes(count: Awaited<ReturnType<typeof countPoll>>) {
  const total = count.reduce((accumulator, [_, value]) => accumulator + value, 0)

  return count.map<APIEmbedField>(([name, value]) => {
    const percent = Math.round(value / total)
    const voteBar = VOTE_BAR_FILL.repeat(percent * VOTE_BAR_WIDTH).padEnd(VOTE_BAR_WIDTH, VOTE_VAR_EMPTY)

    return {
      name,
      value: `\`${voteBar}\` **${percent * 100}%**`,
      inline: false,
    }
  })
}
