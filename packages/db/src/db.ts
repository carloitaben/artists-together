import { createClient as createLibSQLClient, Config } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { env } from "./env"

export function createClient(config?: Omit<Config, "url" | "authToken">) {
  return createLibSQLClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
    ...config,
  })
}

export function connect(config?: Omit<Config, "url" | "authToken">) {
  return drizzle(createClient(config))
}

export const db = connect()
