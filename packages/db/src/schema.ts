import { createInsertSchema } from "drizzle-zod"
import { InferModel } from "drizzle-orm"
import { mysqlTable, serial, timestamp, char, tinyint, varchar, bigint, boolean } from "drizzle-orm/mysql-core"

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

export const discordLiveUsers = mysqlTable("discord_live_users", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  userId: char("user_id", { length: 18 }).notNull(),
})

export const user = mysqlTable("auth_user", {
  id: varchar("id", { length: 31 }).notNull().primaryKey(),
  username: varchar("username", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  bio: varchar("bio", { length: 128 }),
})

export type User = InferModel<typeof user>

export const otp = mysqlTable("auth_otp", {
  id: serial("id").primaryKey(),
  expires: bigint("expires", { mode: "number" }).notNull(),
  password: char("password", { length: 6 }).notNull(),
  userId: varchar("user_id", { length: 15 }).notNull(),
})

export const userSchema = createInsertSchema(user, {
  username: (schema) => schema.username.regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim),
  email: (schema) => schema.email.email(),
})

export const session = mysqlTable("auth_session", {
  id: varchar("id", { length: 127 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull(),
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
})

export const key = mysqlTable("auth_key", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull(),
  hashedPassword: varchar("hashed_password", { length: 255 }),
})
