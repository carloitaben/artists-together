import { fallback } from "@tanstack/router-zod-adapter"
import { z } from "zod"

export const Pathname = z.string().refine((value) => value.startsWith("/"), {
  message: "Pathname must start with a /",
})

export const Geolocation = z
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

export type Geolocation = z.infer<typeof Geolocation>

export const MonthEnum = z.enum([
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
])

export const MonthNumber = z.coerce
  .number()
  .min(1)
  .max(MonthEnum.options.length)

export const Month = z.union([MonthEnum, MonthNumber])

export const OAuthCookieSchema = z.object({
  geolocation: Geolocation,
  pathname: Pathname,
  state: z.string(),
})

export const RootSearchParams = z.object({
  modal: fallback(z.enum(["auth"]).optional(), undefined),
  toast: fallback(z.string().optional(), undefined),
  error: fallback(z.string().optional(), undefined),
  q: fallback(z.string().optional(), undefined),
})

export const CalendarPathParams = z.object({
  year: z.coerce.number().min(1970),
  month: Month,
})

export const AuthEndpointSearchParams = z.union([
  z.object({
    error: z.string(),
    error_description: z.string().optional(),
  }),
  z.object({
    code: z.string().min(1),
    state: z.string().min(1),
  }),
])

export const AuthFormSchema = z.object({
  pathname: Pathname,
})

export const ContactSupportFormSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1).max(300),
})