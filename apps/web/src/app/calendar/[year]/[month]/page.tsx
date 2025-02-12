import * as v from "valibot"
import { notFound } from "next/navigation"
import { CalendarYearMonthPathParams } from "~/lib/schemas"

export default async function Page({ params }: { params: Promise<unknown> }) {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  const parsed = v.safeParse(CalendarYearMonthPathParams, await params)

  if (!parsed.success) {
    notFound()
  }

  return <div>calendar year month</div>
}
