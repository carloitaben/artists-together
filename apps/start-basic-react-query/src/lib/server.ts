import Negotiator from "negotiator"
import { AnyJSONString } from "@artists-together/core/schemas"
import { createServerFn } from "@tanstack/start"
import { getHeaders } from "vinxi/http"
import type { CookieSerializeOptions, HTTPEvent } from "vinxi/http"
import { deleteCookie, getCookie, getHeader, setCookie } from "vinxi/http"
import { isbot } from "isbot"
import type { z, SafeParseReturnType, ZodTypeAny } from "zod"
import { Geolocation } from "./schemas"

export function createCookie<Name extends string, Schema extends ZodTypeAny>({
  name,
  schema,
  options: baseOptions,
}: {
  name: Name
  schema: Schema
  options?: CookieSerializeOptions
}) {
  return {
    has(event: HTTPEvent) {
      const cookie = getCookie(event, name)
      return AnyJSONString.safeParse(cookie).success
    },
    get<Strict extends boolean = false>(
      event: HTTPEvent,
      options?: {
        strict?: Strict
      },
    ): Strict extends true
      ? z.output<Schema>
      : SafeParseReturnType<Schema, z.output<Schema>> {
      const cookie = getCookie(event, name)

      return (
        options?.strict
          ? AnyJSONString.pipe(schema).parse(cookie)
          : AnyJSONString.pipe(schema).safeParse(cookie)
      ) as any
    },
    set(
      event: HTTPEvent,
      value: z.output<Schema>,
      options?: CookieSerializeOptions,
    ) {
      setCookie(event, name, JSON.stringify(schema.parse(value)), {
        ...baseOptions,
        ...options,
      })
    },
    delete(event: HTTPEvent) {
      return deleteCookie(event, name)
    },
  }
}

export function getGeolocation() {
  const geolocation = Geolocation.safeParse({
    city: getHeader("x-vercel-ip-city"),
    country: getHeader("x-vercel-ip-country"),
    continent: getHeader("x-vercel-ip-continent"),
    latitude: getHeader("x-vercel-ip-latitude"),
    longitude: getHeader("x-vercel-ip-longitude"),
    timezone: getHeader("x-vercel-ip-timezone"),
  })

  return geolocation.success ? geolocation.data : null
}

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
