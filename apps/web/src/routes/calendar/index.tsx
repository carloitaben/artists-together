import * as v from "valibot"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { cookieCalendarTabOptions } from "~/services/calendar/shared"
import { getIsomorphicCookie } from "~/lib/isomorphic"
import { MonthNumberToName } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }

    const tab = cookieCalendarTabOptions.safeDecode(
      getIsomorphicCookie(cookieCalendarTabOptions.name),
    )

    const now = new Date()
    const year = now.getFullYear().toString()
    const month = v.parse(MonthNumberToName, now.getMonth() + 1)

    if (tab.success && tab.output === "yearly") {
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
