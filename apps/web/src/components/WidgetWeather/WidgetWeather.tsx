import { Suspense } from "react"
import { z } from "zod"

import { locations } from "~/data/locations"
import { oneOf } from "~/lib/utils"

function handleWeatherCode(code: number) {
  switch (code) {
    case 0:
      return "Clear sky"
    case 1:
    case 2:
    case 3:
      return "Mainly clear, partly cloudy, and overcast"
    case 45:
    case 48:
      return "Fog and depositing rime fog"
    case 51:
    case 53:
    case 55:
      return "Drizzle: Light, moderate, and dense intensity"
    case 56:
    case 57:
      return "Freezing Drizzle: Light and dense intensity"
    case 61:
    case 63:
    case 65:
      return "Rain: Slight, moderate and heavy intensity"
    case 66:
    case 67:
      return "Freezing Rain: Light and heavy intensity"
    case 71:
    case 73:
    case 75:
      return "Snow fall: Slight, moderate, and heavy intensity"
    case 77:
      return "Snow grains"
    case 80:
    case 81:
    case 82:
      return "Rain showers: Slight, moderate, and violent"
    case 85:
    case 86:
      return "Snow showers slight and heavy"
    case 95:
      return "Thunderstorm: Slight or moderate"
    case 96:
    case 99:
      return "Thunderstorm with slight and heavy hail"
    default:
      throw Error(`Unexpected weather code: ${code}`)
  }
}

export const weatherResponseSchema = z.object({
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

async function Content() {
  const location = oneOf(locations)
  const url = new URL("https://api.open-meteo.com/v1/forecast")

  url.searchParams.set("latitude", location.coordinates[0])
  url.searchParams.set("longitude", location.coordinates[1])
  url.searchParams.set("current_weather", "true") // If we end up not using weather.current_weather.weathercode, delete this
  url.searchParams.set("timezone", "auto")
  url.searchParams.set("forecast_days", "2")
  url.searchParams.append(
    "daily",
    "weathercode,temperature_2m_max,temperature_2m_min"
  )

  const weather = await fetch(url.toString()).then((response) =>
    response.json().then((data) => weatherResponseSchema.parse(data))
  )

  return (
    <div className="h-full w-full bg-theme-50 text-theme-700">
      {location.name}
      {/* or if we want the average weathercode for the day {handleWeatherCode(weather.daily.weathercode[0])} */}
      {handleWeatherCode(weather.current_weather.weathercode)}

      <div>
        <strong>hoy</strong>
        <div>min: {weather.daily.temperature_2m_min[0]}</div>
        <div>max: {weather.daily.temperature_2m_max[0]}</div>
      </div>

      <div>
        <strong>mañana</strong>
        <div>{handleWeatherCode(weather.daily.weathercode[1])}</div>
        <div>min: {weather.daily.temperature_2m_min[1]}</div>
        <div>max: {weather.daily.temperature_2m_max[1]}</div>
      </div>
    </div>
  )
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetWeather() {
  return (
    <div className="col-span-3">
      <div className="relative overflow-hidden rounded-l-5xl rounded-r-[14rem] pb-[43.6764705882%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            {/* <Content /> */}
            <Fallback />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
