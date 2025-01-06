import * as v from "valibot"
import { wait } from "@artists-together/core/utils"
import type { WeatherTableInsert } from "@artists-together/core/database"
// import {
//   asc,
//   eq,
//   or,
//   locations,
//   lt,
//   sql,
//   weathers,
//   isNull,
//   connect,
// } from "@artists-together/core"
// import type { Handler } from "aws-lambda"

const weatherResponseSchema = v.pipe(
  v.object({
    latitude: v.number(),
    longitude: v.number(),
    generationtime_ms: v.number(),
    utc_offset_seconds: v.number(),
    timezone: v.string(),
    timezone_abbreviation: v.string(),
    elevation: v.number(),
    current_weather: v.object({
      is_day: v.number(),
      temperature: v.number(),
      time: v.string(),
      winddirection: v.number(),
      windspeed: v.number(),
      weathercode: v.pipe(v.string(), v.transform(Number)),
    }),
    daily: v.object({
      temperature_2m_max: v.tuple([v.number(), v.number()]),
      temperature_2m_min: v.tuple([v.number(), v.number()]),
      weathercode: v.tuple([v.number(), v.number()]),
    }),
  }),
  v.transform((data) => ({
    todayMin: data.daily.temperature_2m_min[0],
    todayMax: data.daily.temperature_2m_max[0],
    todayWeatherCode: data.current_weather.weathercode,
    tomorrowMin: data.daily.temperature_2m_min[1],
    tomorrowMax: data.daily.temperature_2m_max[1],
    tomorrowWeatherCode: data.daily.weathercode[1],
  }))
)

// export const handler: Handler = async () => {
//   const db = connect()

//   const results = await db
//     .select()
//     .from(locations)
//     .leftJoin(weathers, eq(locations.city, weathers.city))
//     .where(
//       or(
//         isNull(weathers.updatedAt),
//         lt(weathers.updatedAt, sql`DATETIME('now', '-6 hours')`)
//       )
//     )
//     .orderBy(asc(weathers.updatedAt))
//     .limit(10)

//   // Run in sequence to prevent rate limiting the API
//   for await (const result of results) {
//     const url = new URL("https://api.open-meteo.com/v1/forecast")
//     url.searchParams.set("latitude", result.locations.latitude)
//     url.searchParams.set("longitude", result.locations.longitude)
//     url.searchParams.set("current_weather", "true")
//     url.searchParams.set("timezone", "auto")
//     url.searchParams.set("forecast_days", "2")
//     url.searchParams.append(
//       "daily",
//       "weathercode,temperature_2m_max,temperature_2m_min"
//     )

//     try {
//       const response = await fetch(url.href)

//       if (!response.ok) {
//         throw Error(`Invalid response: ${response.statusText}`)
//       }

//       await response
//         .json()
//         .then(weatherResponseSchema.parse)
//         .then((data) => Object.assign(data, { city: result.locations.city }))
//         .then((data) =>
//           db.insert(weathers).values(data).onConflictDoUpdate({
//             target: weathers.city,
//             set: data,
//           })
//         )

//       await wait(1_000)
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }
