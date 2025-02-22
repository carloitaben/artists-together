import { queryOptions } from "@tanstack/react-query"
import { getHints } from "./actions"

export const authQueryOptions = queryOptions({
  queryKey: ["hints"],
  async queryFn() {
    return getHints()
  },
})
