import { drizzle, DrizzleConfig } from "drizzle-orm/planetscale-serverless"
import { connect as pscaleConnect, Config } from "@planetscale/database"

export function connect(config?: { drizzleConfig?: DrizzleConfig; dbConfig?: Partial<Config> }) {
  const connection = pscaleConnect({
    host: process.env["DATABASE_HOST"],
    username: process.env["DATABASE_USERNAME"],
    password: process.env["DATABASE_PASSWORD"],
    ...config?.dbConfig,
  })

  return drizzle(connection, config?.drizzleConfig)
}
