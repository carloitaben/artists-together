import { queryOptions } from "@tanstack/react-query"
import { $authenticate } from "./actions"

export const authenticateQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async () => {
    const auth = await $authenticate()

    // TODO: there's a bug with server functions that transforms `null` to `undefined`
    // Query wants serializable values so we have to do this temporary check
    return auth ? auth : null
  },
  staleTime: Infinity,
})
