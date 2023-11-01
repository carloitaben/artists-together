import {
  sqliteTable,
  integer,
  text,
  blob,
  index,
} from "drizzle-orm/sqlite-core"
import { timestamp } from "../utils"

type DiscordUser = any
type TwitchUser = any

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    theme: text("theme").notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    discordId: text("discord_id").unique(),
    discordUsername: text("discord_username").unique(),
    discordMetadata: blob("discord_metadata", {
      mode: "json",
    }).$type<DiscordUser>(),
    twitchId: text("twitch_id").unique(),
    twitchUsername: text("twitch_username").unique(),
    twitchMetadata: blob("twitch_metadata", {
      mode: "json",
    }).$type<TwitchUser>(),
    timestamp: timestamp("timestamp"),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    emailIdx: index("email_idx").on(table.email),
  })
)
