import { timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
}
