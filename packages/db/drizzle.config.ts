import { type Config } from "drizzle-kit"
import { env } from "./src/env"

export default {
  schema: "./src/**/sql.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config
