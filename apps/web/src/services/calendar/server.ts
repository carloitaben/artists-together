import "server-only"
import { wait } from "@artists-together/core/utils"
import { cache } from "react"

export const getCalendarMonthData = cache(async () =>
  wait(3000).then(() => Math.random()),
)
