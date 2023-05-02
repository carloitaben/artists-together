import "dotenv/config"
import { type Config } from "drizzle-kit"

export default {
  schema: "./src/schema.ts",
  connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
} satisfies Config
