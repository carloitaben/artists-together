import {
  TwitchMetadata,
  UserTableInsert,
} from "@artists-together/core/database"
import * as v from "valibot"

export const Pathname = v.pipe(
  v.string(),
  v.startsWith("/", "Pathname must have trailing slash"),
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

export const Settings = v.object({
  fullHourFormat: v.boolean(),
  shareStreaming: v.boolean(),
  shareCursor: v.boolean(),
  fahrenheit: v.boolean(),
})

export type Settings = v.InferOutput<typeof Settings>

export const SettingsUpdate = v.partial(Settings)

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

export const MonthNameToNumber = v.pipe(
  MonthNameList,
  v.transform((value) => MonthNameList.options.indexOf(value) + 1),
)

export const RootSearchParams = v.object({
  modal: v.optional(v.picklist(["auth"])),
  toast: v.optional(v.string()),
  error: v.optional(v.string()),
  q: v.optional(v.string()),
})

export const CalendarYearMonthPathParams = v.object({
  year: v.pipe(
    v.string(),
    v.transform(Number),
    v.integer(),
    v.minValue(1970),
    v.maxValue(2100),
  ),
  month: v.union([
    MonthNameList,
    v.pipe(v.string(), v.transform(Number), MonthNumberToName),
  ]),
})

export const CalendarYearPathParams = v.pick(CalendarYearMonthPathParams, [
  "year",
])

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

export const AuthEndpointTwitchResponseSchema = v.object({
  data: v.tuple([TwitchMetadata]),
})

export const AuthFormSchema = v.object({
  pathname: Pathname,
})

export const AuthConnectionFormSchema = v.object({
  pathname: Pathname,
  provider: v.picklist(["discord", "twitch"]),
})

export const ContactSupportFormSchema = v.object({
  subject: v.pipe(v.string(), v.nonEmpty()),
  message: v.pipe(v.string(), v.nonEmpty(), v.maxLength(300)),
})

export const UpdateProfileFormSchema = v.object({
  bio: v.optional(UserTableInsert.entries.bio),
})
