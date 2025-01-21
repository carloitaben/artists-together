import * as v from "valibot"
import Negotiator from "negotiator"
import { createServerFn } from "@tanstack/start"
import { getHeader, getHeaders } from "vinxi/http"
import { isbot } from "isbot"
import { Geolocation } from "~/lib/schemas"

function getTemperatureUnit(locale: string) {
  switch (locale) {
    case "en-BS":
    case "en-BZ":
    case "en-KY":
    case "en-LR":
    case "en-PW":
    case "en-US":
      return "fahrenheit"
    default:
      return "celsius"
  }
}

function getHourFormat(locale: string) {
  try {
    const dateTimeFormat = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
    })

    return dateTimeFormat.resolvedOptions().hour12 ? "12" : "24"
  } catch (error) {
    console.warn(error, locale)
    return "24"
  }
}

function getGeolocation() {
  const geolocation = v.safeParse(Geolocation, {
    city: getHeader("x-vercel-ip-city"),
    country: getHeader("x-vercel-ip-country"),
    continent: getHeader("x-vercel-ip-continent"),
    latitude: getHeader("x-vercel-ip-latitude"),
    longitude: getHeader("x-vercel-ip-longitude"),
    timezone: getHeader("x-vercel-ip-timezone"),
  })

  return geolocation.success ? geolocation.output : null
}

export const $hints = createServerFn({ method: "GET" }).handler(async () => {
  const geolocation = getGeolocation()
  const headers = getHeaders()
  const negotiator = new Negotiator({ headers })
  const locale = negotiator.language() || "en-US"
  const isBot = isbot(headers["user-agent"])

  return {
    locale,
    isBot,
    geolocation,
    temperatureUnit: getTemperatureUnit(locale),
    hourFormat: getHourFormat(locale),
    saveData: headers["save-data"] === "on",
  }
})
