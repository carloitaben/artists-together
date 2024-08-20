import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

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
  todayMin: integer("today_min"),
  todayMax: integer("today_max"),
  todayWeatherCode: integer("today_weather_code"),
  tomorrowMin: integer("tomorrow_min"),
  tomorrowMax: integer("tomorrow_max"),
  tomorrowWeatherCode: integer("tomorrow_weather_code"),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(current_timestamp)`),
})

export const SelectWeathers = createSelectSchema(weathers).transform(
  (value, context) => {
    // Thanks zod :) https://github.com/colinhacks/zod/pull/3141
    if (
      value.todayMax === null ||
      value.todayWeatherCode === null ||
      value.tomorrowMin === null ||
      value.tomorrowMax === null ||
      value.tomorrowWeatherCode === null
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot be null",
        path: [],
      })

      return z.NEVER
    }

    return value as
      | {
          [K in keyof typeof value]: Exclude<(typeof value)[K], null>
        }
      | null
  }
)

export type InsertWeathers = typeof weathers.$inferInsert

export type SelectWeathers = typeof weathers.$inferSelect
