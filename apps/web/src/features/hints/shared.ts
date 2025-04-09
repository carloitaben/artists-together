import { cookieOptions } from "@standard-cookie/next"
import { Settings } from "~/lib/schemas"

export const cookieSettingsOptions = cookieOptions({
  name: "settings",
  schema: Settings,
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 30,
})

export const defaultCookieSettings: Settings = {
  fahrenheit: false,
  fullHourFormat: true,
  shareCursor: true,
  shareStreaming: true,
}
