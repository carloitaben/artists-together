import * as v from "valibot"
import { sqliteTable, text, index, int } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-valibot"
import { timestamp, timestamps } from "../types"

export const UserSettings = v.object({
  fullHourFormat: v.optional(v.boolean(), false),
  shareStreaming: v.optional(v.boolean(), true),
  shareCursor: v.optional(v.boolean(), true),
  fahrenheit: v.optional(v.boolean(), false),
})

export type UserSettings = v.InferOutput<typeof UserSettings>

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
    discordMetadata: text({ mode: "json" }).$type<{}>(),
    twitchId: text().unique(),
    twitchUsername: text().unique(),
    twitchMetadata: text({ mode: "json" }).$type<{}>(),
    settings: text({ mode: "json" }).$type<UserSettings>(),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    discordIdx: index("discord_idx").on(table.discordId),
  }),
)

export const UserTableInsert = createInsertSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
})

export const UserTableSelect = createSelectSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
})

export const UserTableUpdate = createUpdateSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
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
