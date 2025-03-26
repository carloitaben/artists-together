import { queryOptions } from "@tanstack/react-query"
import { authenticate } from "./actions"

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: authenticate,
})
