import { sqliteTable, text, index, int } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import { z } from "zod"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { timestamp, timestamps } from "../types"

export const DiscordMetadata = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  global_name: z.string().nullable(),
  avatar: z.string().nullable(),
  bot: z.boolean().optional(),
  system: z.boolean().optional(),
  mfa_enabled: z.boolean().optional(),
  verified: z.boolean().optional(),
  email: z.string().optional().nullable(),
  flags: z.number().optional(),
  banner: z.string().optional().nullable(),
  accent_color: z.number().optional().nullable(),
  premium_type: z.number().optional(),
  public_flags: z.number().optional(),
  locale: z.string().optional(),
  avatar_decoration: z.string().optional().nullable(),
})

export type DiscordMetadata = z.output<typeof DiscordMetadata>

export const TwitchMetadata = z.object({
  id: z.string(),
  login: z.string(),
  display_name: z.string(),
  type: z
    .union([
      z.literal(""),
      z.literal("admin"),
      z.literal("staff"),
      z.literal("global_mod"),
    ])
    .transform((value) => value || null),
  broadcaster_type: z
    .union([z.literal(""), z.literal("affiliate"), z.literal("partner")])
    .transform((value) => value || null),
  description: z.string(),
  profile_image_url: z.string(),
  offline_image_url: z.string(),
  view_count: z.number(),
  email: z.string().optional(),
  created_at: z.string(),
})

export type TwitchMetadata = z.output<typeof TwitchMetadata>

export const UserSettings = z.object({
  fullHourFormat: z.boolean().default(false),
  shareStreaming: z.boolean().default(true),
  shareCursor: z.boolean().default(true),
  fahrenheit: z.boolean().default(false),
})

export type UserSettings = z.output<typeof UserSettings>

export const userTable = sqliteTable(
  "user",
  {
    ...timestamps,
    id: int("id").primaryKey(),
    username: text().notNull().unique(),
    pronouns: text(),
    avatar: text(),
    email: text().unique(),
    bio: text(),
    discordId: text().unique(),
    discordUsername: text().unique(),
    discordMetadata: text({ mode: "json" }).$type<DiscordMetadata>(),
    twitchId: text().unique(),
    twitchUsername: text().unique(),
    twitchMetadata: text({ mode: "json" }).$type<DiscordMetadata>(),
    settings: text({ mode: "json" }).$type<UserSettings>(),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    discordIdx: index("discord_idx").on(table.discordId),
  }),
)

export const UserTableInsert = createInsertSchema(userTable, {
  avatar: (schema) => schema.avatar.url(),
  email: (schema) => schema.email.email(),
  bio: (schema) => schema.bio.max(128),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export const UserTableSelect = createSelectSchema(userTable, {
  avatar: (schema) => schema.avatar.url(),
  email: (schema) => schema.email.email(),
  bio: (schema) => schema.bio.max(128),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export type User = typeof userTable.$inferSelect

export const userRelations = relations(userTable, ({ many }) => ({
  contentShared: many(contentSharedTable),
}))

export const liveUserTable = sqliteTable("live_user", {
  discordId: text()
    .notNull()
    .references(() => userTable.discordId, { onDelete: "cascade" }),
  url: text().notNull(),
})

export type LiveUser = typeof liveUserTable.$inferSelect

export const contentSharedTable = sqliteTable("content_shared", {
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  url: text().unique().primaryKey(),
})

export const contentSharedRelations = relations(
  contentSharedTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [contentSharedTable.userId],
      references: [userTable.id],
    }),
  }),
)

export type ContentShared = typeof contentSharedTable.$inferSelect

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp().notNull(),
})

export type Session = typeof sessionTable.$inferSelect
