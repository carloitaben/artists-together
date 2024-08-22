import type { DynamicRoute } from "next-typesafe-url"
import { z } from "zod"
import { monthSchema } from "~/lib/schemas"

export const Route = {
  routeParams: z.object({
    year: z.number().min(1970),
    month: monthSchema,
  }),
} satisfies DynamicRoute

export type RouteType = typeof Route
