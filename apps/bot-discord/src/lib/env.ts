import { config } from "dotenv-mono"
import { z } from "zod"

config()

const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().optional().default(3333),
  DISCORD_BOT_ID: z.string().nonempty().optional(),
  DISCORD_SERVER_ID: z.string().nonempty().optional(),
  DISCORD_BOT_TOKEN: z.string().nonempty(),
})

export const env = schema.parse(process.env)
