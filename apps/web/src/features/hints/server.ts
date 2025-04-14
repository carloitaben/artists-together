import "server-only"
import Negotiator from "negotiator"
import { headers as getHeaders } from "next/headers"
import { userAgent as getUserAgent } from "next/server"
import * as v from "valibot"
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

function getGeolocation({ headers }: { headers: Headers }) {
  const geolocation = v.safeParse(Geolocation, {
    city: headers.get("x-vercel-ip-city"),
    country: headers.get("x-vercel-ip-country"),
    continent: headers.get("x-vercel-ip-continent"),
    latitude: headers.get("x-vercel-ip-latitude"),
    longitude: headers.get("x-vercel-ip-longitude"),
    timezone: headers.get("x-vercel-ip-timezone"),
  })

  return geolocation.success ? geolocation.output : null
}

async function getLocale() {
  const headers = await getHeaders()
  const negotiator = new Negotiator({
    headers: {
      "accept-language": headers.get("accept-language") || undefined,
    },
  })

  const language = negotiator.language() || "*"
  return language === "*" ? "en-US" : language
}

export async function getHints() {
  const headers = await getHeaders()
  const locale = await getLocale()

  return {
    locale,
    isBot: getUserAgent({ headers }).isBot,
    geolocation: getGeolocation({ headers }),
    temperatureUnit: getTemperatureUnit(locale),
    hourFormat: getHourFormat(locale),
    saveData: headers.get("save-data") === "on",
  }
}
