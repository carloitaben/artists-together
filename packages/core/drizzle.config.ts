import "dotenv-mono/load"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "turso",
  schema: "src/database/schema/*",
  strict: true,
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  },
})
