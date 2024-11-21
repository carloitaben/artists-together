import { drizzle } from "drizzle-orm/libsql/web"

console.log("😈😈😈😈😈😈😈 database on client leaking all shit", {
  url: String(process.env.DATABASE_URL),
  authToken: String(process.env.DATABASE_AUTH_TOKEN),
})

export const database = drizzle({
  connection: {
    url: String(process.env.DATABASE_URL),
    authToken: String(process.env.DATABASE_AUTH_TOKEN),
  },
})
