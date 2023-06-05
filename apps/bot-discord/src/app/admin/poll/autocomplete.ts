import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js"

import { polls } from "./lib/polls"

function getChannelWithName(interaction: AutocompleteInteraction, id: string) {
  const channel = interaction.client.channels.cache.get(id)

  if (!channel) {
    throw Error(`Could not find channel with id ${id} in cache`)
  }

  if (!("name" in channel) || !channel.name) {
    throw Error(`Could not find channel name for channel with id ${id}`)
  }

  return channel
}

export default async function handleAutocompletePoll(interaction: AutocompleteInteraction) {
  const value = interaction.options.getFocused()
  const pollsArray = Array.from(polls.values())

  if (!value) {
    return interaction.respond(
      pollsArray
        .map((poll) => {
          const channel = getChannelWithName(interaction, poll.channelId)

          return {
            name: `${poll.name} (in #${channel.name})`,
            value: poll.id,
          }
        })
        .slice(0, 25)
    )
  }

  const filtered = pollsArray.reduce<ApplicationCommandOptionChoiceData[]>((accumulator, poll) => {
    if (poll.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())) {
      const channel = getChannelWithName(interaction, poll.channelId)

      accumulator.push({
        name: `${poll.name} (in #${channel.name})`,
        value: poll.id,
      })
    }

    return accumulator
  }, [])

  return interaction.respond(filtered.slice(0, 25))
}
