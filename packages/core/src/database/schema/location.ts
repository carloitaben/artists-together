import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-valibot"
import { timestamps } from "../types"

export const locationTable = sqliteTable("location", {
  ...timestamps,
  city: text().unique().primaryKey(),
  country: text().notNull(),
  continent: text().notNull(),
  timezone: text().notNull(),
  latitude: text().notNull(),
  longitude: text().notNull(),
})

export const LocationTableInsert = createInsertSchema(locationTable)

export const LocationTableSelect = createSelectSchema(locationTable)

export const LocationTableUpdate = createUpdateSchema(locationTable)

export type Location = typeof locationTable.$inferSelect

export const locationRelations = relations(locationTable, ({ one }) => ({
  weather: one(weatherTable, {
    fields: [locationTable.city],
    references: [weatherTable.city],
  }),
}))

export const weatherTable = sqliteTable("weathers", {
  ...timestamps,
  city: text()
    .unique()
    .primaryKey()
    .references(() => locationTable.city, { onDelete: "cascade" }),
  todayMin: integer().notNull(),
  todayMax: integer().notNull(),
  todayWeatherCode: integer().notNull(),
  tomorrowMin: integer().notNull(),
  tomorrowMax: integer().notNull(),
  tomorrowWeatherCode: integer().notNull(),
})

export const WeatherTableInsert = createInsertSchema(weatherTable)

export const WeatherTableSelect = createSelectSchema(weatherTable)

export const WeatherTableUpdate = createUpdateSchema(weatherTable)

export type Weather = typeof weatherTable.$inferSelect
