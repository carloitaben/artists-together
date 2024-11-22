import { drizzle } from "drizzle-orm/libsql/web"

export const database = drizzle({
  connection: {
    url: String(process.env.DATABASE_URL),
    authToken: String(process.env.DATABASE_AUTH_TOKEN),
  },
})
