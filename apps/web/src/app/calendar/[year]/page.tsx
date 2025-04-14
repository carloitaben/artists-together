import { notFound } from "next/navigation"
import * as v from "valibot"
import { CalendarYearPathParams } from "~/lib/schemas"

export default async function Page({ params }: { params: Promise<unknown> }) {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  const parsed = v.safeParse(CalendarYearPathParams, await params)

  if (!parsed.success) {
    notFound()
  }

  return <div>calendar year</div>
}
