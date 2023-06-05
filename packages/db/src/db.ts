import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect as pscaleConnect, Config } from "@planetscale/database"

export function connect(config?: Partial<Config>) {
  const connection = pscaleConnect({
    host: process.env["DATABASE_HOST"],
    username: process.env["DATABASE_USERNAME"],
    password: process.env["DATABASE_PASSWORD"],
    ...config,
  })

  return drizzle(connection)
}
