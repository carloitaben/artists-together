import * as dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DISCORD_BOT_TOKEN: z.string().nonempty(),
  DISCORD_SERVER_ID: z.string().nonempty(),
})

export const env = schema.parse(process.env)
