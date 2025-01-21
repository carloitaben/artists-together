import * as v from "valibot"
import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental"
import type { Action } from "~/lib/navigation"
import { toaster } from "~/components/Toasts"
import NotFound from "~/components/NotFound"
import { routeTree } from "./router.generated"
import { FormActionSubmissionError } from "~/lib/schemas"

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
      mutations: {
        onError(error) {
          const errorMessage = "Oops! Something went wrong…"

          if (v.is(FormActionSubmissionError, error)) {
            return toaster.create({
              type: "error",
              title: error.error[""]?.[0] || errorMessage,
            })
          }

          if (import.meta.env.DEV) {
            console.error(error)
          }

          toaster.create({
            type: "error",
            title: errorMessage,
          })
        },
      },
    },
  })

  broadcastQueryClient({
    queryClient,
    broadcastChannel: "artists-together",
  })

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: import.meta.env.DEV ? false : "intent",
      defaultNotFoundComponent: () => <NotFound />,
    }),
    queryClient,
  )
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }

  interface StaticDataRouteOption {
    label?: string
    search?: true | string
    actions?: Action[]
  }
}
