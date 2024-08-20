import "server-only"
import Negotiator from "negotiator"
import type { ReactNode } from "react"
import { cache } from "react"
import { headers } from "next/headers"
import { z } from "zod"
import { HintsContextProvider as HintsContextProviderClient } from "./client"

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

export const hints = cache(() => {
  const readonlyHeaders = headers()
  const negotiator = new Negotiator({
    headers: Object.fromEntries(readonlyHeaders.entries()),
  })

  const locale = negotiator.language() || "en-US"

  return {
    locale,
    temperatureUnit: getTemperatureUnit(locale),
    hourFormat: getHourFormat(locale),
    saveData: readonlyHeaders.get("Save-Data") === "on",
  } as const
})

export const geolocationSchema = z
  .object({
    city: z.string(),
    country: z
      .string()
      .refine((value) => value !== "T1", { message: "Tor network" })
      .refine((value) => value !== "XX", { message: "Missing country code" }),
    continent: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    timezone: z.string(),
  })
  .nullable()

export type Geolocation = z.infer<typeof geolocationSchema>

export const geolocation = cache(() => {
  const readonlyHeaders = headers()

  const geolocation = geolocationSchema.safeParse({
    city: readonlyHeaders.get("x-vercel-ip-city"),
    country: readonlyHeaders.get("x-vercel-ip-country"),
    continent: readonlyHeaders.get("x-vercel-ip-continent"),
    latitude: readonlyHeaders.get("x-vercel-ip-latitude"),
    longitude: readonlyHeaders.get("x-vercel-ip-longitude"),
    timezone: readonlyHeaders.get("x-vercel-ip-timezone"),
  })

  if (!geolocation.success) {
    return null
  }

  return geolocation.data
})

export function HintsContextProvider({ children }: { children?: ReactNode }) {
  return (
    <HintsContextProviderClient value={hints()}>
      {children}
    </HintsContextProviderClient>
  )
}
