import { type Config } from "drizzle-kit"
import { load } from "dotenv-mono"
import { env } from "./src/env"

load()

export default {
  schema: "./src/**/sql.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config
