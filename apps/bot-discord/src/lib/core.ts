import type { ClientEvents, SlashCommandBuilder } from "discord.js"
import glob from "fast-glob"

type RegisterEventCallback<T extends keyof ClientEvents> = (...args: ClientEvents[T]) => void

const handlersMap = new Map<keyof ClientEvents, Set<RegisterEventCallback<any>>>()

export function registerEventHandler<T extends keyof ClientEvents>(event: T, callback: RegisterEventCallback<T>) {
  const set = handlersMap.get(event) ?? new Set<RegisterEventCallback<T>>()
  set.add(callback)
  handlersMap.set(event, set)
}

type CommandBuilderStub = Pick<SlashCommandBuilder, "name" | "toJSON">

const slashCommandsMap = new Map<string, CommandBuilderStub>()

export function registerSlashCommand<T extends CommandBuilderStub>(
  builder: T,
  callback: (...args: ClientEvents["interactionCreate"]) => void
) {
  if (slashCommandsMap.has(builder.name)) {
    throw Error(`Found duplicated slash command: ${builder.name}`)
  }

  slashCommandsMap.set(builder.name, builder)

  registerEventHandler("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return
    if (interaction.commandName !== builder.name) return
    callback(interaction)
  })
}

export async function getCore() {
  const files = await glob("src/app/**/*.ts")
  const imports = files.map((file) => import(`../app/${file.replace("src/app", "")}`))

  // Lets side-effects run
  await Promise.all(imports)

  return {
    handlers: handlersMap,
    slashCommands: slashCommandsMap,
  }
}
