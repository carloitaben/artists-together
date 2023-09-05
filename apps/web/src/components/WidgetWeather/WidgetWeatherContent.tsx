/* eslint-disable @next/next/no-img-element */

import { z } from "zod"
import { getLocations } from "~/lib/geo"
import { oneOf } from "~/lib/utils"

function handleWeatherCode(code: number): {
  label: string
  src: string
} {
  switch (code) {
    case 0:
      return {
        label: "Clear sky",
        src: "/icons/weather/sun.svg",
      }
    case 1:
    case 2:
    case 3:
      return {
        label: "Mainly clear, partly cloudy, and overcast",
        src: "/icons/weather/cloud.svg",
      }
    case 45:
    case 48:
      return {
        label: "Fog and depositing rime fog",
        src: "/icons/weather/fog.svg",
      }
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle: Light, moderate, and dense intensity",
        src: "/icons/weather/rain.svg",
      }
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle: Light and dense intensity",
        src: "/icons/weather/rain.svg",
      }
    case 61:
    case 63:
    case 65:
      return {
        label: "Rain: Slight, moderate and heavy intensity",
        src: "/icons/weather/rain.svg",
      }
    case 66:
    case 67:
      return {
        label: "Freezing Rain: Light and heavy intensity",
        src: "/icons/weather/rain.svg",
      }
    case 71:
    case 73:
    case 75:
      return {
        label: "Snow fall: Slight, moderate, and heavy intensity",
        src: "/icons/weather/snow.svg",
      }
    case 77:
      return {
        label: "Snow grains",
        src: "/icons/weather/snow.svg",
      }
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain showers: Slight, moderate, and violent",
        src: "/icons/weather/rain.svg",
      }
    case 85:
    case 86:
      return {
        label: "Snow showers slight and heavy",
        src: "/icons/weather/snow.svg",
      }
    case 95:
      return {
        label: "Thunderstorm: Slight or moderate",
        src: "/icons/weather/storm.svg",
      }
    case 96:
    case 99:
      return {
        label: "Thunderstorm with slight and heavy hail",
        src: "/icons/weather/storm.svg",
      }
    default:
      throw Error(`Unexpected weather code: ${code}`)
  }
}

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

export default async function WidgetWeatherContent() {
  const locations = await getLocations()
  const location = oneOf(locations)
  const url = new URL("https://api.open-meteo.com/v1/forecast")

  url.searchParams.set("latitude", location.latitude)
  url.searchParams.set("longitude", location.longitude)
  url.searchParams.set("current_weather", "true")
  url.searchParams.set("timezone", "auto")
  url.searchParams.set("forecast_days", "2")
  url.searchParams.append(
    "daily",
    "weathercode,temperature_2m_max,temperature_2m_min",
  )

  const weather = await fetch(url.toString()).then((response) =>
    response.json().then((data) => weatherResponseSchema.parse(data)),
  )

  return (
    <div className="flex h-full w-full items-stretch justify-between font-serif font-light text-anamorphic-teal-700 [background:radial-gradient(484.75%_388.20%_at_76.54%_43.27%,#F4F4F4_0%,#50D5FF_100%)] fluid:text-[2rem]/[2.375rem]">
      <div className="fluid:pb-[2.375rem] fluid:pl-12 fluid:pt-[2.625rem]">
        <h6 className="fluid:mb-5">{`${location.city}, ${location.country}`}</h6>
        <span>
          Today <span className="font-serif-ampersand">&</span> Tomorrow
        </span>
        <div className="fluid:text-[4rem]/[4rem]">
          {Math.round(weather.daily.temperature_2m_min[0])}/
          {Math.round(weather.daily.temperature_2m_max[0])}ºC
        </div>
        <div className="flex items-center fluid:gap-5 fluid:text-[4rem]/[4rem]">
          <img
            src={handleWeatherCode(weather.daily.weathercode[1]).src}
            alt={handleWeatherCode(weather.daily.weathercode[1]).label}
            width={201}
            height={201}
            loading="lazy"
            decoding="async"
            className="object-contain drop-shadow-card fluid:mt-1 fluid:h-10 fluid:w-10"
            draggable={false}
          />
          <span>
            {Math.round(weather.daily.temperature_2m_min[1])}/
            {Math.round(weather.daily.temperature_2m_max[1])}ºC
          </span>
        </div>
      </div>
      <div className="fluid:p-12">
        <img
          src={handleWeatherCode(weather.current_weather.weathercode).src}
          alt={handleWeatherCode(weather.current_weather.weathercode).label}
          width={201}
          height={201}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain drop-shadow-card"
          draggable={false}
        />
      </div>
    </div>
  )
}
