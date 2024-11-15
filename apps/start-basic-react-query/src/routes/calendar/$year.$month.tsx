import { createFileRoute, notFound } from "@tanstack/react-router"
import { CalendarPathParams } from "~/lib/schemas"

export const Route = createFileRoute("/calendar/$year/$month")({
  beforeLoad(context) {
    const parsed = CalendarPathParams.safeParse(context.params)

    if (!parsed.success) {
      throw notFound()
    }
  },
  component: Component,
})

function Component() {
  const params = Route.useParams()

  return (
    <div>
      <div>
        Hello calendar year {params.year} month {params.month}
      </div>
    </div>
  )
}
