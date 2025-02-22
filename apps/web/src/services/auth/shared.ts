import { queryOptions } from "@tanstack/react-query"
import { getUser } from "./actions"

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  async queryFn() {
    return getUser()
  },
})
