import { cookieOptions } from "@standard-cookie/next"
import * as v from "valibot"

export const cookieCalendarTabOptions = cookieOptions({
  name: "calendar-tab",
  schema: v.picklist(["monthly", "yearly"]),
})
