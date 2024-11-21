import { createServerFn } from "@tanstack/start"
import { getHeaders } from "vinxi/http"
import { isbot } from "isbot"
import Negotiator from "negotiator"

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
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
  })

  return dateTimeFormat.resolvedOptions().hour12 ? "12" : "24"
}

export const $hints = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getHeaders()
  const negotiator = new Negotiator({ headers })
  const locale = negotiator.language() || "en-US"
  const isBot = isbot(headers["user-agent"])

  return {
    locale,
    isBot,
    temperatureUnit: getTemperatureUnit(locale),
    hourFormat: getHourFormat(locale),
    saveData: headers["save-data"] === "on",
  }
})
