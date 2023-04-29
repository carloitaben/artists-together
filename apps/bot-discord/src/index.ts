import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Client, Partials, GatewayIntentBits } from "discord.js"

import { env } from "~/lib/env"
import { handlersMap } from "~/lib/core"

import "~/app/admin/command"
import "~/app/avatar"
import "~/app/live-role"
import "~/app/role-reactions/friend"
import "~/app/role-reactions/pronouns"
import "~/app/role-reactions/region"

const app = new Hono()

app.use("/static/*", serveStatic({ root: "./" }))

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})

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

handlersMap.forEach((callbacks, event) => {
  bot.addListener(event, (...args) => callbacks.forEach((callback) => callback(...args)))
})

await bot.login(env.DISCORD_BOT_TOKEN)
