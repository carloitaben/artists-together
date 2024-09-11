import { createClient } from "@libsql/client/web"
import { drizzle } from "drizzle-orm/libsql"

const client = createClient({
  url: process.env.DATABASE_URL || "http://127.0.0.1:8080",
  authToken: process.env.DATABASE_AUTH_TOKEN || "",
  intMode: "number",
  fetch: globalThis.fetch,
})

export const database = drizzle(client)
