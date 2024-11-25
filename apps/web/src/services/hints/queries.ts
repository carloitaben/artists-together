import { queryOptions } from "@tanstack/react-query"
import { $hints } from "./server"

export const hintsQueryOptions = queryOptions({
  queryKey: ["hints"],
  queryFn: () => $hints(),
})
