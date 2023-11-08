import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"
import { getSearchParams } from "~/lib/params"

const weatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  current_weather: z.object({
    temperature: z.number(),
    windspeed: z.number(),
    winddirection: z.number(),
    weathercode: z.number(),
    is_day: z.number(),
    time: z.string(),
  }),
  daily_units: z.object({
    time: z.string(),
    weathercode: z.string(),
    temperature_2m_max: z.string(),
    temperature_2m_min: z.string(),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weathercode: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
  }),
})

const searchParams = z.object({
  latitude: z.string(),
  longitude: z.string(),
  units: z
    .union([z.literal("celsius"), z.literal("fahrenheit")])
    .optional()
    .nullable()
    .default("celsius"),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    throw Error("*panics in spanish*")
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast")

  if (params.data.units === "fahrenheit") {
    url.searchParams.set("temperature_unit", "fahrenheit")
  }

  url.searchParams.set("latitude", params.data.latitude)
  url.searchParams.set("longitude", params.data.longitude)
  url.searchParams.set("current_weather", "true")
  url.searchParams.set("timezone", "auto")
  url.searchParams.set("forecast_days", "2")
  url.searchParams.append(
    "daily",
    "weathercode,temperature_2m_max,temperature_2m_min",
  )

  try {
    const weather = await fetch(url.toString()).then((response) =>
      response.json().then((data) => weatherResponseSchema.parse(data)),
    )

    return json(weather)
  } catch (error) {
    console.error(error)
    return json(null)
  }
}

export type Weather = SerializeFrom<typeof loader>
