import { mysqlTable, serial } from "drizzle-orm/mysql-core"

export const keepAliveDummies = mysqlTable("keep_alive_dummies", {
  id: serial("id").primaryKey(),
})
