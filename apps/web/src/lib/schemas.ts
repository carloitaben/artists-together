import { UserTableInsert } from "@artists-together/core/database/schema"
import * as v from "valibot"

export const Pathname = v.pipe(
  v.string(),
  v.check(
    (value) => value.startsWith("/"),
    "Pathname must have trailing slash",
  ),
)

export const Geolocation = v.nullable(
  v.object({
    city: v.string(),
    country: v.pipe(
      v.string(),
      v.check((value) => value !== "T1", "Tor network"),
      v.check((value) => value !== "XX", "Missing country code"),
    ),
    continent: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    timezone: v.string(),
  }),
)

export type Geolocation = v.InferOutput<typeof Geolocation>

export const MonthNameList = v.picklist([
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

export const MonthNumberToName = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(1),
  v.maxValue(MonthNameList.options.length),
  v.transform((value) => MonthNameList.options.at(value - 1)!),
)

export const RootSearchParams = v.object({
  modal: v.optional(v.picklist(["auth"])),
  toast: v.optional(v.string()),
  error: v.optional(v.string()),
  q: v.optional(v.string()),
})

export const CalendarPathParams = v.object({
  year: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1970)),
  month: v.union([
    MonthNameList,
    v.pipe(v.string(), v.transform(Number), MonthNumberToName),
  ]),
})

export const AuthEndpointSearchParams = v.union([
  v.object({
    error: v.string(),
    error_description: v.optional(v.string()),
  }),
  v.object({
    code: v.pipe(v.string(), v.nonEmpty()),
    state: v.pipe(v.string(), v.nonEmpty()),
  }),
])

export const AuthFormSchema = v.object({
  pathname: Pathname,
})

export const ContactSupportFormSchema = v.object({
  subject: v.pipe(v.string(), v.nonEmpty()),
  message: v.pipe(v.string(), v.nonEmpty(), v.maxLength(300)),
})

export const UpdateProfileFormSchema = v.pick(UserTableInsert, ["bio"])

export const CookieSession = v.pipe(v.string(), v.nonEmpty())

export const CookieOAuth = v.object({
  ...AuthFormSchema.entries,
  geolocation: Geolocation,
  fahrenheit: v.boolean(),
  fullHourFormat: v.boolean(),
  state: v.string(),
})
