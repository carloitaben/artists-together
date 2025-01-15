import * as v from "valibot"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { CalendarPathParams } from "~/lib/schemas"
import { cookieCalendarTab } from "~/lib/cookies"

export const Route = createFileRoute("/calendar/$year/")({
  beforeLoad(options) {
    const parsed = v.safeParse(
      v.pick(CalendarPathParams, ["year"]),
      options.params,
    )

    if (!parsed.success) {
      throw notFound()
    }
  },
  loader(options) {
    if (!options.preload) {
      cookieCalendarTab.set("yearly")
    }
  },
  component: Component,
})

function Component() {
  const params = Route.useParams()

  return (
    <div>
      <div>Hello calendar year {params.year}</div>
    </div>
  )
}
