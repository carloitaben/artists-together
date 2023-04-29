import * as dotenv from "dotenv"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { z } from "zod"

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({
  path: join(__dirname, "../../../../", ".env"),
})

const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DISCORD_BOT_ID: z.string().nonempty().optional(),
  DISCORD_SERVER_ID: z.string().nonempty().optional(),
  DISCORD_BOT_TOKEN: z.string().nonempty(),
})

export const env = schema.parse(process.env)
