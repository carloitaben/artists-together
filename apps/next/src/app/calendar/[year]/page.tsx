import dayjs from "dayjs"
import type { InferPagePropsType } from "next-typesafe-url"
import { withParamValidation } from "next-typesafe-url/app/hoc"
import type { RouteType } from "./routeType"
import { Route } from "./routeType"

type Props = InferPagePropsType<RouteType>

function Page({ routeParams }: Props) {
  const date = dayjs().set("year", routeParams.year)

  return <div>calendar {date.format("YYYY")}</div>
}

export default withParamValidation(Page, Route)
