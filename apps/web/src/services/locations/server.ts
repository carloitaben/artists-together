import "server-only"
import { oneOf } from "@artists-together/core/utils"
import {
  db,
  eq,
  isNotNull,
  locations,
  SelectWeathers,
  sql,
  weathers,
} from "@artists-together/db"
import { cache } from "react"
import { unstable_cache } from "next/cache"

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

const SelectWeathersWithCodes = SelectWeathers.transform((data) =>
  Object.assign(data, {
    todayWeatherCode: handleWeatherCode(data.todayWeatherCode),
    tomorrowWeatherCode: handleWeatherCode(data.tomorrowWeatherCode),
  }),
)

export const getRandomLocationsWithWeather = cache(
  unstable_cache(
    async () =>
      db
        .select()
        .from(locations)
        .leftJoin(weathers, eq(locations.city, weathers.city))
        .where(isNotNull(weathers.updatedAt))
        .orderBy(sql`random()`)
        .limit(10),
    [],
    {
      revalidate: 60 * 60 * 6, // 6 hours
    },
  ),
)

export const getRandomLocationWithWeather = cache(async () =>
  getRandomLocationsWithWeather()
    .then((data) => oneOf(data))
    .then((data) => ({
      locations: data.locations,
      weathers: SelectWeathersWithCodes.parse(data.weathers),
    }))
    .then((data) => {
      console.log(">>>", data)
      return data
    }),
)
