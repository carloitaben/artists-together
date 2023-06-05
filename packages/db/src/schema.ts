import { mysqlTable, serial, timestamp, char, tinyint, varchar } from "drizzle-orm/mysql-core"

export const discordPolls = mysqlTable("discord_polls", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
  name: varchar("name", { length: 4_000 }).notNull(),
  deadline: timestamp("deadline"),
  channelId: char("channel_id", { length: 19 }).notNull(),
  messageId: char("message_id", { length: 19 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const discordPollVotes = mysqlTable("discord_poll_votes", {
  id: serial("id").primaryKey(),
  pollId: char("poll_id", { length: 21 }).notNull(),
  userId: char("user_id", { length: 18 }).notNull(),
  /**
   * The index of the answer in the options array.
   */
  answer: tinyint("answer").notNull(),
})
