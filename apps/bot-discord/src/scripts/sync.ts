import { REST, Routes } from "discord.js"

import { env } from "~/lib/env"
import { slashCommandsMap } from "~/lib/core"
import { APPLICATION_ID } from "~/lib/constants"

import "~/app/admin/command"
import "~/app/artist-role"
import "~/app/role-reactions/pronouns"
import "~/app/role-reactions/region"

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN)
const body = Array.from(slashCommandsMap.values()).map((value) => value.toJSON())

try {
  await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, env.DISCORD_SERVER_ID), {
    body,
  })

  console.log(`Synced ${body.length} commands`)
} catch (error) {
  console.error(error)
}
