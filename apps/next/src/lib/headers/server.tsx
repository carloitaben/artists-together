import "server-only"
import Negotiator from "negotiator"
import type { ReactNode } from "react"
import { cache } from "react"
import { headers } from "next/headers"
import { z } from "zod"
import { HintsContextProvider as HintsContextProviderClient } from "./client"

export const hints = cache(() => {
  const readonlyHeaders = headers()
  const negotiator = new Negotiator({
    headers: Object.fromEntries(readonlyHeaders.entries()),
  })

  const locale = negotiator.language() || "en-US"

  const temperatureUnit = [
    "en-BS",
    "en-BZ",
    "en-KY",
    "en-LR",
    "en-PW",
    "en-US",
  ].includes(locale)
    ? ("fahrenheit" as const)
    : ("celsius" as const)

  const timeFormat = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
  }).resolvedOptions()

  return {
    locale,
    temperatureUnit,
    saveData: readonlyHeaders.get("Save-Data") === "on",
    /**
     * - `"h12"` for 12-hour format (e.g., "2 PM")
     * - `"h23"` for 24-hour format starting from 0 (e.g., "14:00")
     * - `"h11"` for 12-hour format starting from 0 (less common)
     * - `"h24"` for 24-hour format starting from 1
     */
    hourCycle: timeFormat.hourCycle || "h23",
  }
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
