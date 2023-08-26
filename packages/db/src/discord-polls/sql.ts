import { mysqlTable, serial, timestamp, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
import { timestamps } from "../sql"

export const discordPolls = mysqlTable("discord_polls", {
  ...timestamps,
  /**
   * ID of the Discord message containing the poll
   */
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 4_000 }).notNull(),
  deadline: timestamp("deadline"),
  channelId: varchar("channel_id", { length: 255 }).notNull(),
  messageId: varchar("message_id", { length: 255 }).notNull(),
})

export const discordPollVotes = mysqlTable(
  "discord_poll_votes",
  {
    ...timestamps,
    id: serial("id").primaryKey(),
    pollId: varchar("poll_id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    /**
     * The index of the answer in the options array.
     */
    answer: tinyint("answer").notNull(),
  },
  (table) => ({
    pollId: uniqueIndex("pollId").on(table.pollId),
  })
)
