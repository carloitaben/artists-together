import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js"

import { polls } from "~/store/polls"

export default async function handleAutocompletePoll(interaction: AutocompleteInteraction) {
  const value = interaction.options.getFocused()
  const pollsArray = Array.from(polls.values())

  if (!value) {
    return interaction.respond(
      pollsArray
        .map((poll) => ({
          name: poll.name,
          value: poll.id,
        }))
        .slice(0, 25)
    )
  }

  const filtered = pollsArray.reduce<ApplicationCommandOptionChoiceData[]>((accumulator, poll) => {
    if (poll.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())) {
      accumulator.push({
        name: poll.name,
        value: poll.id,
      })
    }

    return accumulator
  }, [])

  return interaction.respond(filtered.slice(0, 25))
}
