import * as v from "valibot"
import { createCookie } from "~/lib/cookies"

export const cookieCalendarTab = createCookie({
  name: "calendar-tab",
  schema: v.picklist(["monthly", "yearly"]),
})
