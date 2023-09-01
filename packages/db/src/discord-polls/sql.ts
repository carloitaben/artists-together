import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { timestamp } from "../utils"

export const discordPolls = sqliteTable("discord_polls", {
  /**
   * ID of the Discord message containing the poll
   */
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  deadline: integer("deadline", { mode: "timestamp" }),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id").notNull(),
  timestamp: timestamp("timestamp"),
})

export const discordPollVotes = sqliteTable(
  "discord_poll_votes",
  {
    id: integer("id").primaryKey(),
    pollId: text("poll_id")
      .notNull()
      .references(() => discordPolls.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    /**
     * The index of the answer in the options array.
     */
    answer: integer("answer").notNull(),
    timestamp: timestamp("timestamp"),
  },
  (table) => ({
    pollIdIdx: uniqueIndex("poll_id_idx").on(table.pollId),
  })
)
