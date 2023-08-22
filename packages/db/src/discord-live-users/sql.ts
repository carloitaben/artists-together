import { mysqlTable, serial, char, varchar } from "drizzle-orm/mysql-core"
import { timestamps } from "../sql"

export const discordLiveUsers = mysqlTable("discord_live_users", {
  ...timestamps,
  id: serial("id").primaryKey(),
  /**
   * The url of the livestream
   */
  url: varchar("url", { length: 255 }).notNull(),
  userId: char("user_id", { length: 255 }).notNull(),
})
