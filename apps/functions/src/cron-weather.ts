import { wait } from "@artists-together/core/utils"
import type { InsertWeathers } from "@artists-together/db"
import {
  asc,
  db,
  eq,
  or,
  locations,
  lt,
  sql,
  weathers,
  isNull,
} from "@artists-together/db"
import type { Handler } from "aws-lambda"
import { z } from "zod"

const weatherResponseSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    generationtime_ms: z.number(),
    utc_offset_seconds: z.number(),
    timezone: z.string(),
    timezone_abbreviation: z.string(),
    elevation: z.number(),
    current_weather: z.object({
      is_day: z.number(),
      temperature: z.number(),
      time: z.string(),
      winddirection: z.number(),
      windspeed: z.number(),
      weathercode: z.coerce.number(),
    }),
    daily: z.object({
      temperature_2m_max: z.tuple([z.number(), z.number()]),
      temperature_2m_min: z.tuple([z.number(), z.number()]),
      weathercode: z.tuple([z.number(), z.number()]),
    }),
  })
  .transform(
    (data) =>
      ({
        todayMin: data.daily.temperature_2m_min[0],
        todayMax: data.daily.temperature_2m_max[0],
        todayWeatherCode: data.current_weather.weathercode,
        tomorrowMin: data.daily.temperature_2m_min[1],
        tomorrowMax: data.daily.temperature_2m_max[1],
        tomorrowWeatherCode: data.daily.weathercode[1],
      }) satisfies Omit<InsertWeathers, "city">
  )

export const handler: Handler = async () => {
  const results = await db
    .select()
    .from(locations)
    .leftJoin(weathers, eq(locations.city, weathers.city))
    .where(
      or(
        isNull(weathers.updatedAt),
        lt(weathers.updatedAt, sql`DATETIME('now', '-6 hours')`)
      )
    )
    .orderBy(asc(weathers.updatedAt))
    .limit(10)

  // Run in sequence to prevent rate limiting the API
  for await (const result of results) {
    const url = new URL("https://api.open-meteo.com/v1/forecast")
    url.searchParams.set("latitude", result.locations.latitude)
    url.searchParams.set("longitude", result.locations.longitude)
    url.searchParams.set("current_weather", "true")
    url.searchParams.set("timezone", "auto")
    url.searchParams.set("forecast_days", "2")
    url.searchParams.append(
      "daily",
      "weathercode,temperature_2m_max,temperature_2m_min"
    )

    try {
      const response = await fetch(url.href)

      if (!response.ok) {
        throw Error(`Invalid response: ${response.statusText}`)
      }

      await response
        .json()
        .then(weatherResponseSchema.parse)
        .then((data) => Object.assign(data, { city: result.locations.city }))
        .then((data) =>
          db.insert(weathers).values(data).onConflictDoUpdate({
            target: weathers.city,
            set: data,
          })
        )

      await wait(1_000)
    } catch (error) {
      console.error(error)
    }
  }
}
