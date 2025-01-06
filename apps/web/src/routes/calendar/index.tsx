import * as v from "valibot"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { Month } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = v.safeParse(Month, now.getMonth())

    throw redirect({
      to: "/calendar/$year/$month",
      params: {
        month: String(month),
        year: String(year),
      },
    })
  },
})
