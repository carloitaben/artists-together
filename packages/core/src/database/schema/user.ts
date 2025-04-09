import * as v from "valibot"
import { sqliteTable, text, index, int } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-valibot"
import { timestamp, timestamps } from "../types"

export const DiscordMetadata = v.looseObject({
  id: v.string(),
  username: v.string(),
  avatar: v.nullable(v.string()),
  global_name: v.nullable(v.string()),
  mfa_enabled: v.optional(v.boolean()),
  verified: v.optional(v.boolean()),
  email: v.nullable(v.pipe(v.string(), v.email())),
  locale: v.optional(v.string()),
})

export type DiscordMetadata = v.InferOutput<typeof DiscordMetadata>

export const TwitchMetadata = v.looseObject({
  id: v.string(),
  login: v.string(),
  display_name: v.string(),
  type: v.picklist(["", "admin", "staff", "global_mod"]),
  broadcaster_type: v.picklist(["", "affiliate", "partner"]),
  description: v.string(),
  profile_image_url: v.string(),
  offline_image_url: v.string(),
  view_count: v.number(),
  created_at: v.string(),
})

export type TwitchMetadata = v.InferOutput<typeof TwitchMetadata>

export const UserLinks = v.pipe(
  v.array(v.optional(v.pipe(v.string(), v.url()))),
  v.maxLength(5),
)

export type UserLinks = v.InferOutput<typeof UserLinks>

export const userTable = sqliteTable(
  "user",
  {
    ...timestamps,
    id: int("id").primaryKey(),
    username: text().notNull().unique(),
    pronouns: text(),
    avatar: text(),
    email: text().unique(),
    links: text({ mode: "json" }).$type<UserLinks>(),
    bio: text(),
    discordId: text().unique(),
    discordUsername: text().unique(),
    discordMetadata: text({ mode: "json" }).$type<DiscordMetadata>(),
    twitchId: text().unique(),
    twitchUsername: text().unique(),
    twitchMetadata: text({ mode: "json" }).$type<TwitchMetadata>(),
  },
  (table) => [
    index("username_idx").on(table.username),
    index("discord_idx").on(table.discordId),
  ],
)

export const UserTableInsert = createInsertSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  links: UserLinks,
  bio: (schema) => v.pipe(schema, v.maxLength(128)),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export const UserTableSelect = createSelectSchema(userTable, {
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
  avatar: (schema) => v.pipe(schema, v.url()),
  links: UserLinks,
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(128)),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export const UserTableUpdate = createUpdateSchema(userTable, {
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
  avatar: (schema) => v.pipe(schema, v.url()),
  links: UserLinks,
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(128)),
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
