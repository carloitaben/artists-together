import { Suspense } from "react"
import { z } from "zod"

import { locations } from "~/data/locations"
import { oneOf } from "~/lib/utils"
import Icon from "../Icon"

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
  url.searchParams.set("current_weather", "true")
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
    <div className="flex h-full w-full items-stretch justify-between font-serif font-light text-anamorphic-teal-700 [background:radial-gradient(484.75%_388.20%_at_76.54%_43.27%,#F4F4F4_0%,#50D5FF_100%)] fluid:text-[2rem]/[2.375rem]">
      <div className="fluid:pb-[2.375rem] fluid:pl-12 fluid:pt-[2.625rem]">
        <h6 className="fluid:mb-5">{location.name}</h6>
        <span>
          Today <span className="font-serif-ampersand">&</span> Tomorrow
        </span>
        <div className="fluid:text-[4rem]/[4rem]">
          {Math.round(weather.daily.temperature_2m_min[0])}/
          {Math.round(weather.daily.temperature_2m_max[0])}ºC
        </div>
        <div className="flex items-center fluid:gap-5 fluid:text-[4rem]/[4rem]">
          <Icon
            label={handleWeatherCode(weather.daily.weathercode[1])}
            className="fluid:mt-1 fluid:h-10 fluid:w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                fill="#FAFAFA"
                d="M10.833 33.333c-2.527 0-4.687-.875-6.479-2.625-1.792-1.75-2.687-3.888-2.687-6.416 0-2.167.652-4.098 1.958-5.792s3.014-2.778 5.125-3.25c.694-2.556 2.083-4.625 4.167-6.208C15 7.458 17.36 6.667 20 6.667c3.25 0 6.007 1.132 8.27 3.396 2.265 2.263 3.397 5.02 3.397 8.27 1.916.223 3.507 1.049 4.77 2.48 1.264 1.43 1.896 3.104 1.896 5.02 0 2.084-.729 3.855-2.187 5.313-1.459 1.458-3.23 2.187-5.313 2.187h-20Z"
              />
            </svg>
          </Icon>
          <span>
            {Math.round(weather.daily.temperature_2m_min[1])}/
            {Math.round(weather.daily.temperature_2m_max[1])}ºC
          </span>
        </div>
      </div>
      <Icon
        className="fluid:p-12"
        label={handleWeatherCode(weather.daily.weathercode[1])}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 206 206"
        >
          <circle cx="103" cy="103" r="103" fill="#F7BE02" />
        </svg>
      </Icon>
    </div>
  )
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetWeather() {
  return (
    <div className="col-span-3 select-none">
      <div className="relative overflow-hidden rounded-l-5xl rounded-r-[9.375rem] pb-[43.6764705882%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
