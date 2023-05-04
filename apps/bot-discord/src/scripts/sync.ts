import { REST, Routes } from "discord.js"

import { env } from "~/lib/env"
import { getRegistrations } from "~/lib/core"
import { APPLICATION_ID, SERVER_ID } from "~/lib/constants"

const registrations = await getRegistrations()
const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)
const body = Array.from(registrations.slashCommands.values()).map((value) => value.toJSON())

try {
  await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID), {
    body,
  })

  console.log(`Synced ${body.length} commands`)
} catch (error) {
  console.error(error)
}
