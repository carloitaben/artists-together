import { config } from "dotenv-mono"
import { z } from "zod"

config()

const schema = z.object({
  DATABASE_URL: z.string().url().default("http://127.0.0.1:8080"),
  DATABASE_AUTH_TOKEN: z.string().default(""),
})

export const env = schema.parse(process.env)
