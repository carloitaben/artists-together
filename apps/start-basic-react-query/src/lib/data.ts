import Negotiator from "negotiator"
import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"
import { getHeaders } from "vinxi/http"
import { isbot } from "isbot"
import { authenticate } from "~/services/auth/actions"

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

export const getHints = createServerFn("GET", async () => {
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

export const hintsQueryOptions = queryOptions({
  queryKey: ["hints"],
  queryFn: () => getHints(),
  staleTime: Infinity,
})

export const authenticateQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: () => authenticate(),
  staleTime: Infinity,
})
