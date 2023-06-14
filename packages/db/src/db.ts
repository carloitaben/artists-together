import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect as pscaleConnect, Config } from "@planetscale/database"

export function createConnection(config?: Partial<Config>) {
  return pscaleConnect({
    host: process.env["DATABASE_HOST"],
    username: process.env["DATABASE_USERNAME"],
    password: process.env["DATABASE_PASSWORD"],
    ...config,
  })
}

export function connect(config?: Partial<Config>) {
  const connection = createConnection(config)
  return drizzle(connection)
}
