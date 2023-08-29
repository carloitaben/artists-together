import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { timestamps } from "../sql"

export const discordLiveUsers = sqliteTable("discord_live_users", {
  ...timestamps,
  id: integer("id").primaryKey(),
  /**
   * The url of the livestream
   */
  url: text("url").notNull(),
  userId: text("user_id").notNull(),
})
