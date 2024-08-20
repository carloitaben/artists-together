import dayjs from "dayjs"
import type { InferPagePropsType } from "next-typesafe-url"
import { withParamValidation } from "next-typesafe-url/app/hoc"
import { monthEnumSchema } from "~/lib/schemas"
import type { RouteType } from "./routeType"
import { Route } from "./routeType"

type Props = InferPagePropsType<RouteType>

function Page({ routeParams }: Props) {
  const monthIndex = monthEnumSchema.options.findIndex(
    (month) => month === routeParams.month,
  )

  const date = dayjs().set("year", routeParams.year).set("month", monthIndex)

  return <div>calendar {date.format("MM/YYYY")}</div>
}

export default withParamValidation(Page, Route)
