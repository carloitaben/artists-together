import * as dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const schema = z.object({
  DISCORD_BOT_TOKEN: z.string().nonempty(),
  DISCORD_SERVER_ID: z.string().nonempty(),
  DISCORD_APPLICATION_ID: z.string().nonempty(),
})

export const env = schema.parse(process.env)
