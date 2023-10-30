import { sqliteTable, integer } from "drizzle-orm/sqlite-core"

export const keepAliveDummies = sqliteTable("keep_alive_dummies", {
  id: integer("id").primaryKey(),
})
