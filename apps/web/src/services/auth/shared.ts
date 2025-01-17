import { queryOptions } from "@tanstack/react-query"
import { $authenticate } from "./actions"

export const authenticateQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async () => $authenticate(),
})
