import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { timestamp } from "../utils"

export const discordLiveUsers = sqliteTable("discord_live_users", {
  id: integer("id").primaryKey(),
  /**
   * The url of the livestream
   */
  url: text("url").notNull(),
  userId: text("user_id").notNull(),
  timestamp: timestamp("timestamp"),
})
