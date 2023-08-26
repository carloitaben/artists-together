import { config } from "dotenv-mono"
import { type Config } from "drizzle-kit"

config()

export default {
  schema: "./src/**/sql.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config
