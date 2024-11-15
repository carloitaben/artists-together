import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "turso",
  schema: "src/database/schema/*.ts",
  strict: true,
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
    authToken: String(process.env.DATABASE_TOKEN),
  },
})