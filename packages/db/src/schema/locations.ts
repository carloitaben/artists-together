import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const locations = sqliteTable("locations", {
  city: text("city").unique().primaryKey(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  timezone: text("timezone").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
})

export type InsertLocations = typeof locations.$inferInsert

export type SelectLocations = typeof locations.$inferSelect

export const locationsRelations = relations(locations, ({ one }) => ({
  weather: one(weathers, {
    fields: [locations.city],
    references: [weathers.city],
  }),
}))

export const weathers = sqliteTable("weathers", {
  city: text("city")
    .unique()
    .primaryKey()
    .references(() => locations.city, { onDelete: "cascade" }),
  todayMin: integer("today_min").notNull(),
  todayMax: integer("today_max").notNull(),
  todayWeatherCode: integer("today_weather_code").notNull(),
  tomorrowMin: integer("tomorrow_min").notNull(),
  tomorrowMax: integer("tomorrow_max").notNull(),
  tomorrowWeatherCode: integer("tomorrow_weather_code").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(current_timestamp)`),
})

export const InsertWeathers = createInsertSchema(weathers)

export const SelectWeathers = createSelectSchema(weathers)

export type InsertWeathers = typeof weathers.$inferInsert

export type SelectWeathers = typeof weathers.$inferSelect
