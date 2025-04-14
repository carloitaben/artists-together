import { drizzle } from "drizzle-orm/libsql/web"
import withRetry from "fetch-retry"
import "../server-only"

const fetch = withRetry(globalThis.fetch)

export const database = drizzle({
  connection: {
    url: String(process.env.DATABASE_URL),
    authToken: String(process.env.DATABASE_AUTH_TOKEN),
    fetch,
  },
})
