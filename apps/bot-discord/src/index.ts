import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Client, Partials, GatewayIntentBits } from "discord.js"

import { env } from "~/lib/env"
import { getCore } from "~/lib/core"

const app = new Hono()

app.use("/static/*", serveStatic({ root: "./" }))

serve({ fetch: fetch, port: env.PORT })

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

bot.once("ready", () => console.log("🚀"))

const core = await getCore()

core.handlers.forEach((callbacks, event) => {
  bot.addListener(event, (...args) => callbacks.forEach((callback) => callback(...args)))
})

await bot.login(env.DISCORD_BOT_TOKEN)
