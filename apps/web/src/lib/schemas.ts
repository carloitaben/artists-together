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

const MonthList = v.picklist([
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

export const Month = v.union([
  MonthList,
  v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.minValue(1),
    v.maxValue(MonthList.options.length),
    v.transform((value) => MonthList.options.at(value - 1)!),
  ),
])

export type Month = v.InferOutput<typeof Month>

export const RootSearchParams = v.object({
  modal: v.optional(v.picklist(["auth"])),
  toast: v.optional(v.string()),
  error: v.optional(v.string()),
  q: v.optional(v.string()),
})

export const CalendarPathParams = v.object({
  year: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1970)),
  month: Month,
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

// export const UpdateprofileFormSchema = UserTableInsert.pick({
//   bio: true,
// }).extend({
//   settings: UserSettings.partial(),
// })

export const UpdateProfileFormSchema = v.object({
  bio: v.nullable(v.pipe(v.string(), v.maxLength(300))),
})

export const CookieSession = v.pipe(v.string(), v.nonEmpty())

export const CookieOAuth = v.object({
  ...AuthFormSchema.entries,
  geolocation: Geolocation,
  fahrenheit: v.boolean(),
  fullHourFormat: v.boolean(),
  state: v.string(),
})
