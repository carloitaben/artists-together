import dayjs from "dayjs"
import type { InferPagePropsType } from "next-typesafe-url"
import { withParamValidation } from "next-typesafe-url/app/hoc"
import { monthEnumSchema } from "~/lib/schemas"
import type { RouteType } from "./routeType"
import { Route } from "./routeType"
import CalendarCell from "../../components/CalendarCell"

type Props = InferPagePropsType<RouteType>

function Page({ routeParams }: Props) {
  const monthIndex = monthEnumSchema.options.findIndex(
    (month) => month === routeParams.month,
  )

  const date = dayjs().set("year", routeParams.year).set("month", monthIndex)

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

export default withParamValidation(Page, Route)
