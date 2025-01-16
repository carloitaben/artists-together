import * as v from "valibot"
import { cookieOptions } from "~/lib/cookies"

export const cookieCalendarTabOptions = cookieOptions({
  name: "calendar-tab",
  schema: v.picklist(["monthly", "yearly"]),
})
