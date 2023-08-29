import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { timestamps } from "../sql"

export const discordPolls = sqliteTable("discord_polls", {
  ...timestamps,
  /**
   * ID of the Discord message containing the poll
   */
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  deadline: integer("deadline", { mode: "timestamp" }),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id").notNull(),
})

export const discordPollVotes = sqliteTable(
  "discord_poll_votes",
  {
    ...timestamps,
    id: integer("id").primaryKey(),
    pollId: text("poll_id")
      .notNull()
      .references(() => discordPolls.id),
    userId: text("user_id").notNull(),
    /**
     * The index of the answer in the options array.
     */
    answer: integer("answer").notNull(),
  },
  (table) => ({
    pollIdIdx: uniqueIndex("poll_id_idx").on(table.pollId),
  }),
)
