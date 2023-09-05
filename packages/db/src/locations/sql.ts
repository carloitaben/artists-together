import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core"
import { user } from "src/users/sql"
import { Geo } from "."

export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  geo: blob("geo", { mode: "json" }).$type<Geo>().notNull(),
})
