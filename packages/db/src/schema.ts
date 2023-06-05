import { InferModel } from "drizzle-orm"
import { mysqlTable, text, tinyint, int, boolean, varchar, char, serial, timestamp } from "drizzle-orm/mysql-core"

/**
 * PlanetScale deactivates databases without activity.
 * In the Discord bot deployment we write daily to this table
 * to prevent deactivation
 */
export const keepAliveDummies = mysqlTable("keep_alive_dummies", {
  id: serial("id").primaryKey(),
})

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

export const otps = mysqlTable("otps", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  active: boolean("active").notNull().default(false),
  attempts: int("attempts").notNull().default(0),
})

export type Otp = InferModel<typeof otps>

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  bio: text("bio"),
})

export type User = InferModel<typeof users>
