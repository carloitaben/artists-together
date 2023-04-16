import * as dotenv from "dotenv"
import { z } from "zod"
import { Client, GatewayIntentBits } from "discord.js"

dotenv.config()

const schema = z.object({
  DISCORD_BOT_TOKEN: z.string().nonempty(),
})

const env = schema.parse(process.env)

const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
})

await bot.login(env.DISCORD_BOT_TOKEN)
