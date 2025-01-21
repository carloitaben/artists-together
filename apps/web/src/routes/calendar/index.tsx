import * as v from "valibot"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { MonthNumberToName } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }

    const now = new Date()
    const year = now.getFullYear().toString()
    const month = v.parse(MonthNumberToName, now.getMonth() + 1)

    throw redirect({
      to: "/calendar/$year/$month",
      params: {
        year,
        month,
      },
    })
  },
})
