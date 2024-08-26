import dayjs from "dayjs"
import { z } from "zod"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { monthEnumSchema, monthSchema } from "~/lib/schemas"
import CalendarCell from "./components/CalendarCell"

const paramsSchema = z.object({
  year: z.coerce.number().min(1970),
  month: monthSchema,
})

type Params = z.output<typeof paramsSchema>

type Props = {
  params: Params
  searchParams: ReadonlyURLSearchParams
}

export default function Page({ params }: Props) {
  const parsedParams = paramsSchema.parse(params)
  const monthIndex = monthEnumSchema.options.findIndex(
    (month) => month === parsedParams.month,
  )

  const date = dayjs().set("year", parsedParams.year).set("month", monthIndex)

  return (
    <main>
      <div>calendar {date.format("MM/YYYY")}</div>
      <div>
        <CalendarCell />
        <CalendarCell />
        <CalendarCell />
        <CalendarCell />
        <CalendarCell />
      </div>
    </main>
  )
}
