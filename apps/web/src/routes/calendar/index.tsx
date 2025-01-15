import * as v from "valibot"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { cookieCalendarTab } from "~/lib/cookies"
import { MonthNumberToName } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }

    const now = new Date()
    const year = now.getFullYear().toString()
    const month = v.parse(MonthNumberToName, now.getMonth() + 1)
    const cookie = cookieCalendarTab.safeParse()

    if (cookie.success && cookie.output === "yearly") {
      throw redirect({
        to: "/calendar/$year",
        params: { year },
      })
    } else {
      throw redirect({
        to: "/calendar/$year/$month",
        params: { year, month },
      })
    }
  },
})
