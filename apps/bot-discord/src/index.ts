import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Client, Partials, GatewayIntentBits } from "discord.js"

import { env } from "~/lib/env"
import { getRegistrations } from "~/lib/core"

const app = new Hono()

app.use("/public/*", serveStatic({ root: "./" }))

serve(
  {
    fetch: app.fetch,
    port: Number(env.PORT || 3333),
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`)
  }
)

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

const registrations = await getRegistrations()

registrations.handlers.forEach((callbacks, event) => {
  bot.addListener(event, (...args) => callbacks.forEach((callback) => callback(...args)))
})

await bot.login(env.DISCORD_BOT_TOKEN)
