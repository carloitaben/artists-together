import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { MonthEnum } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = MonthEnum.options[now.getMonth()]

    throw redirect({
      to: "/calendar/$year/$month",
      params: {
        month: String(month),
        year: String(year),
      },
    })
  },
})
