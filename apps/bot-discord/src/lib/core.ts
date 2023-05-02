import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  SlashCommandBuilder,
} from "discord.js"

type RegisterEventCallback<T extends keyof ClientEvents> = (...args: ClientEvents[T]) => void

export const handlersMap = new Map<keyof ClientEvents, Set<RegisterEventCallback<any>>>()

export function registerEventHandler<T extends keyof ClientEvents>(event: T, callback: RegisterEventCallback<T>) {
  const set = handlersMap.get(event) ?? new Set<RegisterEventCallback<T>>()
  set.add(callback)
  handlersMap.set(event, set)
}

type CommandBuilderStub = Pick<SlashCommandBuilder, "name" | "toJSON">

export const slashCommandsMap = new Map<string, CommandBuilderStub>()

export function registerSlashCommand<T extends CommandBuilderStub>(
  builder: T,
  callback: (interaction: AutocompleteInteraction | ChatInputCommandInteraction) => void
) {
  if (slashCommandsMap.has(builder.name)) {
    throw Error(`Found duplicated slash command: ${builder.name}`)
  }

  slashCommandsMap.set(builder.name, builder)

  registerEventHandler("interactionCreate", (interaction) => {
    if (interaction.isAutocomplete()) {
      if (interaction.commandName === builder.name) return callback(interaction)
    }

    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === builder.name) return callback(interaction)
    }
  })
}
