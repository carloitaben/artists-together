import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { timestamps } from "../types"

export const locationTable = sqliteTable("location", {
  ...timestamps,
  city: text("city").unique().primaryKey(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  timezone: text("timezone").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
})

export const LocationTableInsert = createInsertSchema(locationTable)

export const LocationTableSelect = createSelectSchema(locationTable)

export type LocationTableInsert = typeof locationTable.$inferInsert

export type LocationTableSelect = typeof locationTable.$inferSelect

export const locationRelations = relations(locationTable, ({ one }) => ({
  weather: one(weatherTable, {
    fields: [locationTable.city],
    references: [weatherTable.city],
  }),
}))

export const weatherTable = sqliteTable("weathers", {
  ...timestamps,
  city: text("city")
    .unique()
    .primaryKey()
    .references(() => locationTable.city, { onDelete: "cascade" }),
  todayMin: integer("today_min").notNull(),
  todayMax: integer("today_max").notNull(),
  todayWeatherCode: integer("today_weather_code").notNull(),
  tomorrowMin: integer("tomorrow_min").notNull(),
  tomorrowMax: integer("tomorrow_max").notNull(),
  tomorrowWeatherCode: integer("tomorrow_weather_code").notNull(),
})

export const WeatherTableInsert = createInsertSchema(weatherTable)

export const WeatherTableSelect = createSelectSchema(weatherTable)

export type WeatherTableInsert = typeof weatherTable.$inferInsert

export type WeatherTableSelect = typeof weatherTable.$inferSelect
