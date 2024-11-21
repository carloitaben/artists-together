import { queryOptions } from "@tanstack/react-query"

export const hintsQueryOptions = queryOptions({
  queryKey: ["hints"],
  queryFn: () => ({}),
  staleTime: Infinity,
})
