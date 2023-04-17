import { Client, Partials, GatewayIntentBits } from "discord.js"

import { env } from "~/lib/env"
import { handlersMap } from "~/lib/core"

import "~/app/admin/say"
import "~/app/reactions/pronouns"
import "~/app/reactions/region"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

await bot.login(env.DISCORD_BOT_TOKEN)

handlersMap.forEach((callbacks, event) => {
  bot.addListener(event, (...args) => callbacks.forEach((callback) => callback(...args)))
})
