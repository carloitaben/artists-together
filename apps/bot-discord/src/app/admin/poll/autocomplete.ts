import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js"

import { polls } from "~/store/polls"

export default async function handleAutocompletePoll(interaction: AutocompleteInteraction) {
  const value = interaction.options.getFocused()

  if (!value) {
    return interaction.respond(
      Array.from(polls)
        .map((poll) => ({
          name: poll.name,
          value: String(poll.id),
        }))
        .slice(0, 25)
    )
  }

  const filtered = Array.from(polls).reduce<ApplicationCommandOptionChoiceData[]>((accumulator, poll) => {
    if (poll.name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())) {
      accumulator.push({
        name: poll.name,
        value: String(poll.id),
      })
    }

    return accumulator
  }, [])

  return interaction.respond(filtered.slice(0, 25))
}
