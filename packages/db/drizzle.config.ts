import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  driver: "turso",
  schema: "src/schema/*.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL || "http://127.0.0.1:8080",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
})
