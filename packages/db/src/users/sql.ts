import type { DiscordUser, TwitchUser } from "@lucia-auth/oauth/providers"
import { sqliteTable, text, blob, index } from "drizzle-orm/sqlite-core"
import { timestamp } from "../utils"

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    theme: text("theme").notNull(),
    avatar: text("avatar"),
    discord_id: text("discord_id").unique(),
    discord_username: text("discord_username").unique(),
    discord_metadata: blob("discord_metadata", {
      mode: "json",
    }).$type<DiscordUser>(),
    twitch_id: text("twitch_id").unique(),
    twitch_username: text("twitch_username").unique(),
    twitch_metadata: blob("twitch_metadata", {
      mode: "json",
    }).$type<TwitchUser>(),
    timestamp: timestamp("timestamp"),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    emailIdx: index("email_idx").on(table.email),
  })
)

export const key = sqliteTable("auth_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  hashedPassword: text("hashed_password"),
})

export const session = sqliteTable("auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
})
