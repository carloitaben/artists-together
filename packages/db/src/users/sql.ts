import type { DiscordUser, TwitchUser } from "@lucia-auth/oauth/providers"
import {
  sqliteTable,
  text,
  blob,
  index,
  integer,
} from "drizzle-orm/sqlite-core"
import { timestamp } from "../utils"

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    theme: text("theme").notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    links: blob("links", { mode: "json" })
      .notNull()
      .default(JSON.stringify([]))
      .$type<string[]>(),
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
    settings_use_24_hour_format: integer("settings_use_24_hour_format", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    settings_share_location: integer("settings_share_location", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settings_share_streaming: integer("settings_share_streaming", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settings_share_cursor: integer("settings_share_cursor", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settings_fahrenheit: integer("settings_fahrenheit", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

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
    .references(() => users.id, { onDelete: "cascade" }),
  hashedPassword: text("hashed_password"),
})

export const session = sqliteTable("auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
})
