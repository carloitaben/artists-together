import * as v from "valibot"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { cookieCalendarTabOptions } from "~/services/calendar/shared"
import { setIsomorphicCookie } from "~/lib/isomorphic"
import { CalendarPathParams } from "~/lib/schemas"

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
      setIsomorphicCookie(
        cookieCalendarTabOptions.name,
        cookieCalendarTabOptions.encode("yearly"),
        cookieCalendarTabOptions.options,
      )
    }
  },
  head() {
    return {
      meta: [
        {
          name: "robots",
          content: "noindex, nofollow",
        },
      ],
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
