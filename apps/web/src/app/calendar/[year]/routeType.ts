import type { DynamicRoute } from "next-typesafe-url"
import { z } from "zod"

export const Route = {
  routeParams: z.object({
    year: z.number().min(1970),
  }),
} satisfies DynamicRoute

export type RouteType = typeof Route
