import { config } from "dotenv-mono"
import { z } from "zod"

config()

const schema = z.object({
  VERCEL_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_AUTH_TOKEN: z.string().default(""),
  DISCORD_SERVER_ID: z.string().nonempty().optional(),
  DISCORD_OAUTH_ID: z.string().nonempty(),
  DISCORD_OAUTH_SECRET: z.string().nonempty(),
  TWITCH_OAUTH_ID: z.string().nonempty(),
  TWITCH_OAUTH_SECRET: z.string().nonempty(),
})

export const env = schema.parse(process.env)
