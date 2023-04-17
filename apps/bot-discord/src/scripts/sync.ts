import { REST, Routes } from "discord.js"

import { env } from "~/lib/env"
import { say } from "~/index"

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)
const body = [say.toJSON()]

try {
  await rest.put(Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_SERVER_ID), {
    body,
  })

  console.log(`Synced ${body.length} commands`)
} catch (error) {
  console.error(error)
}
